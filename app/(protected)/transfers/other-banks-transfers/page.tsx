"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loading } from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appStore } from "@/store";
import { formatCurrency } from "@/utils/formatNumber";
import {
  ReturnAcctDetails2,
  getNeftBanks,
  returnNameEnquiry,
  // balanceEnquiry,
  fundTransfer,
} from "@/services/apiAuth";
import { generateTransactionId } from "@/utils/generateTransactionId";
import { generatePaymentReference } from "@/utils/paymentReference";
import TransactionModal from "@/components/TransactionModal"; // Import the modal

export default function ThirdPartyTransfers() {
  const { userData } = appStore();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  // const [balance, setBalance] = useState<string | null>(null);
  // const [balanceError, setBalanceError] = useState<string | null>(null);
  const [nameEnquiryResult, setNameEnquiryResult] = useState<any | null>(null);
  const [nameEnquiryError, setNameEnquiryError] = useState<string | null>(null);
  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "failed";
    transactionData?: any;
  }>({
    isOpen: false,
    type: "success",
  });

  // Fetch accounts for all accounts in userData.acctCollection
  const {
    data: accountData,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useQuery({
    queryKey: ["my-accounts"],
    queryFn: async () => {
      if (!userData?.userRec || !userData?.acctCollection?.length) {
        return { success: false, data: [] };
      }

      const userRec = {
        accCode: userData.userRec.accCode || "",
        puserName: userData.userRec.puserName || "",
      };

      const accountPromises = userData.acctCollection.map(
        async (account: any) => {
          const payload = [
            {
              customerId: account.customerID,
              accountNumber: account.accountNumber,
            },
          ];
          const response = await ReturnAcctDetails2(userRec, payload);
          return response;
        }
      );

      const responses = await Promise.all(accountPromises);

      const accounts = responses.flatMap((response, index) => {
        if (response.success && response.data) {
          return response.data.map((account: any) => ({
            accountNumber: account.accountNumber,
            accountName: account.description,
            availBal: account.availBal,
            namCurrency: account.currency,
            codAcctType: account.type === "Current" ? "CK" : "SV",
            CustomerID: userData.acctCollection[index].CustomerID,
          }));
        }
        console.error(
          `Failed to fetch details for account ${userData.acctCollection[index].accountNumber}:`,
          response.errorMessage
        );
        return [userData.acctCollection[index]];
      });

      return { success: true, data: accounts };
    },
    enabled: !!userData?.userRec && !!userData?.acctCollection?.length,
  });

  const accounts = accountData?.success
    ? accountData.data
    : userData?.acctCollection || [];

  const { data: neftBanks, isLoading: isLoadingNeftBanks } = useQuery({
    queryKey: ["neft-banks"],
    queryFn: getNeftBanks,
  });

  // const { mutate: balanceEnquiryMutate, isPending: isBalanceEnquiryPending } = useMutation({
  //   mutationFn: balanceEnquiry,
  //   onSuccess: (res: any) => {
  //     setBalance(res?.availableBalance || "Balance retrieved successfully");
  //     setBalanceError(null);
  //   },
  //   onError: (error: any) => {
  //     setBalanceError("Failed to fetch balance. Please try again.");
  //   },
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: fundTransfer,
    onSuccess: (data: any) => {
      // Only treat as success if the bank returns responseCode '00'
      if (data?.responseCode === "00" || data?.responseCode === "0") {
        setModalState({
          isOpen: true,
          type: "success",
          transactionData: {
            amount: data.amount || data.transferAmount,
            beneficiaryAccountName:
              data.beneficiaryAccountName || data.accountName,
            beneficiaryAccountNumber:
              data.beneficiaryAccountNumber || data.accountNumber,
            paymentReference: data.paymentReference,
            transactionId: data.transactionId || data.transactionReference,
          },
        });
        setStep(1);
        methods.reset();
        setNameEnquiryResult(null);
        setNameEnquiryError(null);
      } else {
        // Business logic failure (e.g., "Insufficient funds", "Duplicate transaction", etc.)
        const errorMessage =
          data?.responseMessage || data?.message || "Transaction failed";
        setModalState({
          isOpen: true,
          type: "failed",
          transactionData: { errorMessage },
        });
      }
    },
    onError: (error: any) => {
      // Network error, timeout, 500, etc.
      const errorMessage = error?.message || "Network error. Please try again.";
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: { errorMessage },
      });
    },
  });
  const thirdPartyTransfersSchema = z.object({
    sourceAccount: z.string().min(1, "Please select your source account"),
    dailyTransferLimit: z.number().min(0, "Daily transfer limit required"),
    bankCode: z.string().min(1, "Please select a destination bank"),
    destinationAccountNumber: z
      .string()
      .regex(/^\d+$/, "Account number must contain only numeric values")
      .min(10, "Account number must be at least 10 digits long"),
    destinationAccountName: z.string().optional(),
    transferAmount: z.coerce.number().min(1, "Please enter a transfer amount"),
    narration: z.string().optional(),
  });

  const defaultValues = {
    sourceAccount: "",
    dailyTransferLimit: 0,
    bankCode: "",
    destinationAccountNumber: "",
    destinationAccountName: "",
    transferAmount: 0,
    narration: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(thirdPartyTransfersSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const sourceAccount = watch("sourceAccount");
    if (sourceAccount && sourceAccount.length >= 10) {
      const limit = userData?.pLimitsObject?.find(
        (limit: any) => limit.accountnumber === sourceAccount
      )?.interBankLimit;
      setValue("dailyTransferLimit", Number(limit) || 0);
    }
  }, [watch("sourceAccount"), userData, setValue]);

  const { data: nameEnquiryData, isLoading: isLoadingNameEnquiry } = useQuery({
    queryKey: [
      "name-enquiry",
      watch("bankCode"),
      watch("destinationAccountNumber"),
    ],
    queryFn: () =>
      returnNameEnquiry({
        channelCode: "1",
        accountNumber: watch("destinationAccountNumber"),
        destinationInstitutionCode: watch("bankCode"),
        transactionId: generateTransactionId(),
      }),
    enabled:
      !!watch("bankCode") &&
      /^[0-9]+$/.test(watch("destinationAccountNumber")) &&
      watch("destinationAccountNumber").length >= 10,
    onError: (error: any) => {
      setNameEnquiryError("Invalid account number or bank. Please try again.");
    },
  });

  useEffect(() => {
    if (nameEnquiryData?.success) {
      setNameEnquiryResult(nameEnquiryData);
      setNameEnquiryError(null);
      setValue("destinationAccountName", nameEnquiryData.data?.accountName);
    }
  }, [nameEnquiryData, setValue]);

  // useEffect(() => {
  //   if (nameEnquiryResult?.success) {
  //     balanceEnquiryMutate({
  //       channelCode: nameEnquiryResult.data?.channelCode,
  //       targetAccountName: nameEnquiryResult.data?.accountName,
  //       targetAccountNumber: nameEnquiryResult.data?.accountNumber,
  //       targetBankVerificationNumber:
  //         nameEnquiryResult.data?.bankVerificationNumber,
  //       authorizationCode: `MA-${watch(
  //         "destinationAccountNumber"
  //       )}-2022315-53097`,
  //       destinationInstitutionCode:
  //         nameEnquiryResult.data?.destinationInstitutionCode,
  //       billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
  //       transactionId: generateTransactionId(),
  //     });
  //   }
  // }, [nameEnquiryResult, balanceEnquiryMutate, watch]);

  useEffect(() => {
    const sourceAccount = watch("sourceAccount");
    if (sourceAccount && sourceAccount.length >= 10) {
      const selected = accounts?.find(
        (account: any) => account.accountNumber?.toString() === sourceAccount
      );
      if (selected) {
        setSelectedAccount({
          ...selected,
          accountName: selected.accountName,
        });
      } else {
        setSelectedAccount(null);
      }
    } else {
      setSelectedAccount(null);
    }
  }, [watch("sourceAccount"), accounts]);

  const nextStep = async () => {
    const fields = {
      1: ["sourceAccount", "dailyTransferLimit"],
      2: ["bankCode", "destinationAccountNumber"],
      3: ["transferAmount"],
    }[step];

    const isValid = await trigger(fields as any);
    if (!isValid) return;

    if (step === 3) {
      const amount = getValues("transferAmount") as number;
      const limit = getValues("dailyTransferLimit") as number;
      if (amount > limit) {
        methods.setError("transferAmount", {
          type: "manual",
          message: "Amount exceeds daily transfer limit",
        });
        return;
      }
    }

    if (step !== 2 || nameEnquiryResult?.success) {
      setStep((prev) => Math.min(prev + 1, 4));
    } else if (step === 2 && !nameEnquiryResult?.success) {
      setNameEnquiryError(
        "Please wait for account verification or correct the details."
      );
    }
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: z.infer<typeof thirdPartyTransfersSchema>) => {
    if (!nameEnquiryResult?.success || !selectedAccount) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: {
          errorMessage:
            "Please complete steps 1 and 2 to select source account and verify beneficiary.",
        },
      });
      return;
    }

    if (data.transferAmount > data.dailyTransferLimit) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: {
          errorMessage: "Transfer amount exceeds daily transfer limit.",
        },
      });
      return;
    }

    const cleanedAccountName = selectedAccount.accountName
      .replace(/\s+/g, " ")
      .trim();

    // const newData = {
    //   sourceInstitutionCode: "000525",
    //   amount: data.transferAmount,
    //   beneficiaryAccountName: nameEnquiryResult.data.accountName,
    //   beneficiaryAccountNumber: nameEnquiryResult.data.accountNumber,
    //   beneficiaryBankVerificationNumber:
    //     nameEnquiryResult.data.bankVerificationNumber,
    //   beneficiaryKYCLevel: nameEnquiryResult.data.kycLevel,
    //   channelCode: nameEnquiryResult.data.channelCode,
    //   originatorAccountName: cleanedAccountName,
    //   originatorAccountNumber: selectedAccount.accountNumber,
    //   originatorBankVerificationNumber: "33333333333",
    //   originatorKYCLevel: "1",
    //   destinationInstitutionCode:
    //     nameEnquiryResult.data.destinationInstitutionCode,
    //   mandateReferenceNumber: `MA-${nameEnquiryResult.data.accountNumber}-2022315-53097`,
    //   nameEnquiryRef: nameEnquiryResult.data.sessionID,
    //   originatorNarration:
    //     data.narration || `Transfer to ${nameEnquiryResult.data.accountName}`,
    //   paymentReference: generatePaymentReference(),
    //   transactionId: generateTransactionId(),
    //   transactionLocation: "1.38716,3.05117",
    //   beneficiaryNarration:
    //     data.narration || `Transfer to ${nameEnquiryResult.data.accountName}`,
    //   billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
    //   initiatorAccountName: cleanedAccountName,
    //   initiatorAccountNumber: selectedAccount.accountNumber,
    // };

    const newData = {
      sourceInstitutionCode: "999998",
      amount: 100,
      beneficiaryAccountName: "Ake Mobolaji & Temabo",
      beneficiaryAccountNumber: "1780004070",
      beneficiaryBankVerificationNumber: "22222222226",
      beneficiaryKYCLevel: 1,
      channelCode: 1,
      originatorAccountName: "vee Test",
      originatorAccountNumber: "0112345678",
      originatorBankVerificationNumber: 33333333333,
      originatorKYCLevel: 1,
      destinationInstitutionCode: 999998,
      mandateReferenceNumber: `MA-0112345678-2022315-53097`,
      nameEnquiryRef: "999999191106195503191106195503",
      originatorNarration: "Payment from 0112345678 to 1780004070 Test123 ",
      paymentReference: "NIPMINI/828281672",
      transactionId:  generateTransactionId(),
      transactionLocation: "1.38716,3.05117",
      beneficiaryNarration:
        "Payment from 0112345678 to 1780004070 Test123 ",
      billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
      initiatorAccountName: "Helen Test",
      initiatorAccountNumber: "0912345678",
    };

    console.log("Submitting transfer:", newData);
    mutate(newData);
  };

  const banks = neftBanks?.data;

  if (isLoadingAccounts || isLoadingNeftBanks) return <Loading />;
  if (accountsError)
    return (
      <div className="text-red-500">
        Error fetching accounts: {accountsError.message}
      </div>
    );

  return (
    <main className="h-full w-full flex flex-col gap-6 items-center md:justify-center">
      <h2 className="text-2xl font-bold">Other Banks Transfers</h2>

      <div className="w-full text-center mb-4">
        <h3 className="text-lg">Step {step} of 4</h3>
        <p className="text-gray-600">
          {step === 1 &&
            "Select your source account and view daily transfer limit"}
          {step === 2 && "Enter beneficiary and destination account"}
          {step === 3 && "Enter transfer amount and narration"}
          {step === 4 && "Confirm transfer details"}
        </p>
      </div>

      {nameEnquiryError && step === 2 && (
        <div className="text-red-600">{nameEnquiryError}</div>
      )}

      <Form {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] md:w-2/3 grid grid-cols-1 gap-4 border border-border rounded-md p-6"
        >
          {step === 1 && (
            <>
              <FormField
                control={control}
                name="sourceAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Account</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Source Account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account: any) => (
                            <SelectItem
                              key={
                                account.accountNumber?.toString() ||
                                Math.random().toString()
                              }
                              value={account.accountNumber?.toString()}
                            >
                              {account.accountNumber} -{" "}
                              {formatCurrency(Number(account.availBal) || 0)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="dailyTransferLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Transfer Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Daily transfer limit"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={control}
                name="bankCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Bank</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Destination Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks?.map((bank: any) => (
                            <SelectItem
                              key={bank.bankCode}
                              value={bank.bankCode}
                            >
                              {bank.bankName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="destinationAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Account</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter destination account"
                        disabled={isLoadingNameEnquiry}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {nameEnquiryResult?.success && (
                <div className="text-gray-600">
                  Account Name: {nameEnquiryResult.data?.accountName}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                control={control}
                name="transferAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter transfer amount"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="narration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter narration" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <p className="mb-4">
                You are about to transfer{" "}
                {formatCurrency(getValues("transferAmount"))} from your account{" "}
                {getValues("sourceAccount")} to{" "}
                {getValues("destinationAccountNumber")},{" "}
                {nameEnquiryResult?.data?.accountName}.
              </p>
              {selectedAccount?.availBal && (
                <p className="mb-4">
                  Source Account Balance:{" "}
                  {formatCurrency(Number(selectedAccount.availBal) || 0)}
                </p>
              )}
              <p className="font-bold mb-4">Do you want to proceed?</p>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={previousStep}
                variant="outline"
                className="mr-2"
              >
                Back
              </Button>
            )}

            {step < 4 && (
              <Button
                type="button"
                className="ml-auto"
                onClick={nextStep}
                disabled={isPending || isLoadingNameEnquiry}
              >
                {isLoadingNameEnquiry ? "Loading..." : "Next"}
              </Button>
            )}

            {step === 4 && (
              <>
                <Button type="button" onClick={previousStep} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="ml-auto" disabled={isPending}>
                  {isPending ? "Processing..." : "Confirm Transfer"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        transactionData={modalState.transactionData}
      />
    </main>
  );
}
