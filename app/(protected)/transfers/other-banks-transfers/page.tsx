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
  balanceEnquiry,
  fundTransfer,
} from "@/services/apiAuth";
import { generateTransactionId } from "@/utils/generateTransactionId";
import { generatePaymentReference } from "@/utils/paymentReference";

export default function ThirdPartyTransfers() {
  const { userData } = appStore();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [nameEnquiryResult, setNameEnquiryResult] = useState<any | null>(null);
  const [nameEnquiryError, setNameEnquiryError] = useState<string | null>(null);

  // Fetch accounts
  const { data, isLoading } = useQuery({
    queryKey: ["my-accounts"],
    queryFn: () =>
      ReturnAcctDetails2(
        2,
        userData?.userRec,
        userData?.acctCollection?.AcctStruct
      ),
    enabled: !!userData?.acctCollection?.AcctStruct,
  });

  const accounts = userData?.acctCollection || [];
  console.log(accounts)

  // Fetch NEFT banks
  const { data: neftBanks, isLoading: isLoadingNeftBanks } = useQuery({
    queryKey: ["neft-banks"],
    queryFn: getNeftBanks,
  });

  // Balance enquiry mutation
  const { mutate: balanceEnquiryMutate, isPending: isBalanceEnquiryPending } =
    useMutation({
      mutationFn: balanceEnquiry,
      onSuccess: (res: any) => {
        setBalance(res?.availableBalance || "Balance retrieved successfully");
        setBalanceError(null);
      },
      onError: (error: any) => {
        setBalanceError("Failed to fetch balance. Please try again.");
      },
    });

  // Fund transfer mutation
  const { mutate, isPending } = useMutation({
    mutationFn: fundTransfer,
    onSuccess: (res: any) => {
      setStep(1);
      methods.reset();
      setNameEnquiryResult(null);
      setBalance(null);
      setBalanceError(null);
      setNameEnquiryError(null);
      alert("Transfer successful!"); // Replace with react-hot-toast in production
    },
    onError: (error: any) => {
      alert(`Transfer failed: ${error.message}`); // Replace with react-hot-toast
    },
  });

  // Zod schema aligned with fundTransfer payload
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

  // Default values
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

  // Update name enquiry result
  useEffect(() => {
    if (nameEnquiryData?.success) {
      setNameEnquiryResult(nameEnquiryData);
      setNameEnquiryError(null);
      setValue(
        "destinationAccountName",
        nameEnquiryData.data?.accountName
      );
    }
  }, [nameEnquiryData, setValue]);

  // Trigger balance enquiry for source account
  useEffect(() => {
    if (nameEnquiryResult?.success) {
      balanceEnquiryMutate({
        channelCode: nameEnquiryResult.data?.channelCode,
        targetAccountName: nameEnquiryResult.data?.accountName,
        targetAccountNumber: nameEnquiryResult.data?.accountNumber,
        targetBankVerificationNumber:
          nameEnquiryResult.data?.bankVerificationNumber,
        authorizationCode: `MA-${watch(
          "destinationAccountNumber"
        )}-2022315-53097`,
        destinationInstitutionCode:
          nameEnquiryResult.data?.destinationInstitutionCode,
        billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
        transactionId: generateTransactionId(),
      });
    }
  }, [nameEnquiryResult, balanceEnquiryMutate, watch]);

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
      1: ["sourceAccount", "dailyTransferLimit"],
      2: ["bankCode", "destinationAccountNumber"],
      3: ["transferAmount"],
    }[step];

    const isValid = await trigger(fields as any);
    if (!isValid) return;

    // Manual validation for transfer amount vs daily limit (step 3)
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
    // Guard: Prevent submission if required data missing
    if (!nameEnquiryResult?.success || !selectedAccount) {
      alert(
        "Please go back to step 1 & 2 to select source account and verify beneficiary."
      );
      return;
    }

    // Manual validation: Amount <= daily limit
    if (data.transferAmount > data.dailyTransferLimit) {
      alert("Transfer amount exceeds daily transfer limit.");
      return;
    }

    const newData = {
      sourceInstitutionCode: "999998",
      amount: data.transferAmount,
      beneficiaryAccountName: nameEnquiryResult.data.accountName,
      beneficiaryAccountNumber: nameEnquiryResult.data.accountNumber,
      beneficiaryBankVerificationNumber:
        nameEnquiryResult.data.bankVerificationNumber,
      beneficiaryKYCLevel: nameEnquiryResult.data.kycLevel,
      channelCode: nameEnquiryResult.data.channelCode,
      originatorAccountName: selectedAccount.accountName,
      originatorAccountNumber: selectedAccount.accountNumber,
      originatorBankVerificationNumber: "33333333333",
      originatorKYCLevel: "1",
      destinationInstitutionCode:
        nameEnquiryResult.data.destinationInstitutionCode,
      mandateReferenceNumber: `MA-${
        nameEnquiryResult.data.accountNumber
      }-2022315-53097`,
      nameEnquiryRef:
        nameEnquiryResult.data.transactionId || generateTransactionId(),
      originatorNarration:
        data.narration ||
        `Transfer to ${nameEnquiryResult.data.accountName}`,
      paymentReference: generatePaymentReference(),
      transactionId: generateTransactionId(),
      transactionLocation: "0.0.0.0,0.0.0.0",
      beneficiaryNarration:
        data.narration ||
        `Transfer to ${nameEnquiryResult.data.accountName}`,
      billerId:
        nameEnquiryResult.data.billerId,
      initiatorAccountName: selectedAccount.accountName,
      initiatorAccountNumber: selectedAccount.accountNumber,
    };

    console.log("Submitting transfer:", newData);
    mutate(newData);
  };

  const banks = neftBanks?.data;

  if (isLoading || isLoadingNeftBanks) return <Loading />;

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

      {balance && step === 2 && (
        <div className="text-green-600">
          Source Account Balance: {formatCurrency(Number(balance) || 0)}
        </div>
      )}
      {balanceError && step === 2 && (
        <div className="text-red-600">{balanceError}</div>
      )}
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
                              {formatCurrency(
                                Number(account.availBalance) || 0
                              )}
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
                        disabled={
                          isLoadingNameEnquiry || isBalanceEnquiryPending
                        }
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
              {balance && (
                <p className="mb-4">
                  Source Account Balance: {formatCurrency(Number(balance) || 0)}
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
                disabled={
                  isPending || isLoadingNameEnquiry || isBalanceEnquiryPending
                }
              >
                {isLoadingNameEnquiry || isBalanceEnquiryPending
                  ? "Loading..."
                  : "Next"}
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
    </main>
  );
}
