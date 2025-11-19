"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loading } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  returnNameEnquiryNomase,
  internalTransfer,
} from "@/services/apiAuth"; // Assuming these are available in apiAuth
import { generateTransactionId } from "@/utils/generateTransactionId";
import { generatePaymentReference } from "@/utils/paymentReference";
import TransactionModal from "@/components/TransactionModal"; // Reusing the modal

export default function InterBankLocalTransfers() {
  const { userData } = appStore();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [nameEnquiryResult, setNameEnquiryResult] = useState<any | null>(null);
  const [nameEnquiryError, setNameEnquiryError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "failed";
    transactionData?: any;
  }>({
    isOpen: false,
    type: "success",
  });

  // Fetch accounts
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

  // Internal transfer mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const response = await internalTransfer(payload);
      
      // If retVal is NOT "00", treat it as a business error
      if (response?.retVal !== "00") {
        const error = new Error(
          response?.retMsg || response?.message || "Transfer failed"
        );
        (error as any).responseData = response; // optional: keep full response for debugging
        throw error;
      }
      
     return { response, payload }; // Only successful transactions reach here
    },
    onSuccess: ({ response, payload }) => {
      // This now ONLY runs when retVal === "00"
      setModalState({
        isOpen: true,
        type: "success",
        transactionData: {
          amount: response.amount || payload?.amount,
          beneficiaryAccountName:
            response.beneficiaryAccountName || payload?.beneficiaryAccountName,
          beneficiaryAccountNumber:
            response.beneficiaryAccountNumber ||
            payload?.beneficiaryAccountNumber,
          paymentReference:
            response.paymentReference || payload?.paymentReference,
          transactionId: response.transactionId || payload?.transactionId,
        },
      });

      // Reset form state
      setStep(1);
      methods.reset();
      setNameEnquiryResult(null);
      setNameEnquiryError(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.responseData?.retMsg ||
        error?.responseData?.message ||
        error?.message ||
        "Transfer failed. Please try again.";

      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: { errorMessage },
      });
    },
  });

  // Zod schema aligned with internalTransfer payload
  const internalTransfersSchema = z.object({
    sourceAccount: z.string().min(1, "Please select your source account"),
    dailyTransferLimit: z.number().min(0, "Daily transfer limit required"),
    destinationAccount: z
      .string()
      .min(10, "Account number must be at least 10 digits long")
      .regex(/^\d+$/, "Account number must contain only numeric values"),
    destinationAccountName: z.string().optional(),
    transferAmount: z.coerce.number().min(1, "Please enter a transfer amount"),
    narration: z.string().optional(),
  });

  const defaultValues = {
    sourceAccount: "",
    dailyTransferLimit: 0,
    destinationAccount: "",
    destinationAccountName: "",
    transferAmount: 0,
    narration: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(internalTransfersSchema),
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

  // Set daily transfer limit
  useEffect(() => {
    const sourceAccount = watch("sourceAccount");
    if (sourceAccount && sourceAccount.length >= 10) {
      const limit = userData?.pLimitsObject?.find(
        (limit: any) => limit.accountnumber === sourceAccount
      )?.interBankLimit;
      setValue("dailyTransferLimit", Number(limit) || 0);
    }
  }, [watch("sourceAccount"), userData, setValue]);

  // Name enquiry query
  const { data: nameEnquiryData, isLoading: isLoadingNameEnquiry } = useQuery({
    queryKey: ["name-enquiry", watch("destinationAccount")],
    queryFn: () =>
      returnNameEnquiryNomase({
        accountNumber: watch("destinationAccount"),
      }),
    enabled:
      !!watch("destinationAccount") &&
      /^[0-9]+$/.test(watch("destinationAccount")) &&
      watch("destinationAccount").length >= 10,
    onError: (error: any) => {
      setNameEnquiryError("Invalid account number. Please try again.");
    },
  });

  // Update name enquiry result
  useEffect(() => {
    if (nameEnquiryData?.success) {
      setNameEnquiryResult(nameEnquiryData);
      setNameEnquiryError(null);
      setValue(
        "destinationAccountName",
        nameEnquiryData.data?.data?.cod_acct_title
      );
      console.log(
        "destinationAccountName",
        nameEnquiryData.data?.data?.cod_acct_title
      );
    }
  }, [nameEnquiryData, setValue]);

  // Set selected account
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

  // Next step validation
  const nextStep = async () => {
    const fields = {
      1: ["sourceAccount", "dailyTransferLimit", "destinationAccount"],
      2: ["transferAmount"],
      3: [],
    }[step];

    const isValid = await trigger(fields as any);
    if (!isValid) return;

    // Manual validation for transfer amount vs daily limit (step 2)
    if (step === 2) {
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

    if (step !== 1 || nameEnquiryResult?.success) {
      setStep((prev) => Math.min(prev + 1, 3));
    } else if (step === 1 && !nameEnquiryResult?.success) {
      setNameEnquiryError(
        "Please wait for account verification or correct the details."
      );
    }
  };

  const previousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: z.infer<typeof internalTransfersSchema>) => {
    if (!nameEnquiryResult?.success || !selectedAccount) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: {
          errorMessage:
            "Please complete step 1 to select source account and verify destination account.",
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

    if (data.sourceAccount === data.destinationAccount) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: {
          errorMessage: "Source and destination accounts cannot be the same.",
        },
      });
      return;
    }

    const cleanedAccountName = selectedAccount.accountName
      .replace(/\s+/g, " ")
      .trim();

    const newData = {
      sourceInstitutionCode: "000525",
      amount: data.transferAmount,
      beneficiaryAccountName: nameEnquiryResult.data?.data.cod_acct_title,
      beneficiaryAccountNumber: nameEnquiryResult.data?.data.cod_acct_no,
      beneficiaryBankVerificationNumber: "33333333333",
      beneficiaryKYCLevel: 1,
      channelCode: 1,
      originatorAccountName: cleanedAccountName,
      originatorAccountNumber: selectedAccount.accountNumber,
      originatorBankVerificationNumber: "33333333333",
      originatorKYCLevel: 1,
      destinationInstitutionCode: "000525", // Same bank
      mandateReferenceNumber: `MA-${nameEnquiryResult.data?.data.cod_acct_no}-20251110-53097`,
      nameEnquiryRef: "999999191106195503191106195503",
      originatorNarration:
        data.narration ||
        `Transfer to ${nameEnquiryResult.data?.data.cod_acct_title}`,
      paymentReference: generatePaymentReference(),
      transactionId: generateTransactionId(),
      transactionLocation: "1.38716,3.05117",
      beneficiaryNarration:
        data.narration ||
        `Transfer to ${nameEnquiryResult.data?.data.cod_acct_title}`,
      billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
      initiatorAccountName: cleanedAccountName,
      initiatorAccountNumber: selectedAccount.accountNumber,
    };

    console.log("Submitting internal transfer:", newData);
    mutate(newData);
  };

  if (isLoadingAccounts) return <Loading />;
  if (accountsError)
    return (
      <div className="text-red-500">
        Error fetching accounts: {accountsError.message}
      </div>
    );

  return (
    <main className="h-full w-full flex flex-col gap-6 items-center md:justify-center">
      <h2 className="text-2xl font-bold">Internal Transfers</h2>

      <div className="w-full text-center mb-4">
        <h3 className="text-lg">Step {step} of 3</h3>
        <p className="text-gray-600">
          {step === 1 && "Select your source and destination accounts"}
          {step === 2 && "Enter transfer amount and narration"}
          {step === 3 && "Confirm transfer details"}
        </p>
      </div>

      {nameEnquiryError && step === 1 && (
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

              <FormField
                control={control}
                name="destinationAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Account</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter destination account number"
                        disabled={isLoadingNameEnquiry}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {nameEnquiryResult?.success && (
                <div className="text-gray-600">
                  Account Name: {nameEnquiryResult.data?.data?.cod_acct_title}
                </div>
              )}
            </>
          )}

          {step === 2 && (
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

          {step === 3 && (
            <div className="text-center">
              <p className="mb-4">
                You are about to transfer{" "}
                {formatCurrency(getValues("transferAmount"))} from your account{" "}
                {getValues("sourceAccount")} to{" "}
                {getValues("destinationAccount")},{" "}
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

            {step < 3 && (
              <Button
                type="button"
                className="ml-auto"
                onClick={nextStep}
                disabled={isPending || isLoadingNameEnquiry}
              >
                {isLoadingNameEnquiry ? "Loading..." : "Next"}
              </Button>
            )}

            {step === 3 && (
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

      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        transactionData={modalState.transactionData}
      />
    </main>
  );
}
