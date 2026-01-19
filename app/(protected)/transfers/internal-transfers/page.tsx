"use client";

import { useState, useEffect, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";

import { appStore } from "@/store";
import { formatCurrency } from "@/utils/formatNumber";
import {
  ReturnAcctDetails2,
  returnNameEnquiryNomase,
  internalTransfer,
  validateOtp,
} from "@/services/apiAuth";
import { generateTransactionId } from "@/utils/generateTransactionId";
import { generatePaymentReference } from "@/utils/paymentReference";
import TransactionModal from "@/components/TransactionModal";

export default function InterBankLocalTransfers() {
  const { toast } = useToast();
  const { userData } = appStore();

  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [nameEnquiryResult, setNameEnquiryResult] = useState<any | null>(null);
  const [nameEnquiryError, setNameEnquiryError] = useState<string | null>(null);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);

  // Store pending transfer payload
  const [pendingTransferData, setPendingTransferData] = useState<any>(null);

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

  // Transfer mutation (now called only after OTP)
  const { mutate } = useMutation({
    mutationFn: async (payload) => {
      const response = await internalTransfer(payload);
      if (response?.retVal !== "00") {
        const error = new Error(
          response?.retMsg || response?.message || "Transfer failed"
        );
        (error as any).responseData = response;
        throw error;
      }
      return { response, payload };
    },
    onSuccess: ({ response, payload }) => {
      toast({
        title: "Transfer Successful!",
        description: `₦${formatCurrency(payload.amount)} sent to ${
          payload.beneficiaryAccountName
        }`,
      });
      setModalState({
        isOpen: true,
        type: "success",
        transactionData: {
          amount: payload.amount,
          beneficiaryAccountName: payload.beneficiaryAccountName,
          beneficiaryAccountNumber: payload.beneficiaryAccountNumber,
          paymentReference: payload.paymentReference,
          transactionId: payload.transactionId,
        },
      });
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.responseData?.retMsg ||
        error?.responseData?.message ||
        error?.message ||
        "Transfer failed. Please try again.";
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: { errorMessage },
      });
    },
  });

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
    onError: () => {
      setNameEnquiryError("Invalid account number. Please try again.");
    },
  });

  useEffect(() => {
    if (nameEnquiryData?.success) {
      setNameEnquiryResult(nameEnquiryData);
      setNameEnquiryError(null);
      setValue(
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

  const nextStep = async () => {
    const fields = {
      1: ["sourceAccount", "dailyTransferLimit", "destinationAccount"],
      2: ["transferAmount"],
      3: [],
    }[step];

    const isValid = await trigger(fields as any);
    if (!isValid) return;

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

  const resetForm = () => {
    setStep(1);
    methods.reset();
    setNameEnquiryResult(null);
    setNameEnquiryError(null);
    setPendingTransferData(null);
  };

  // Step 3: Confirm → Show OTP Modal
  const handleConfirmTransfer = async (
    data: z.infer<typeof internalTransfersSchema>
  ) => {
    if (!nameEnquiryResult?.success || !selectedAccount) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: {
          errorMessage: "Please verify destination account first.",
        },
      });
      return;
    }

    if (data.transferAmount > data.dailyTransferLimit) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: { errorMessage: "Amount exceeds daily limit" },
      });
      return;
    }

    if (data.sourceAccount === data.destinationAccount) {
      setModalState({
        isOpen: true,
        type: "failed",
        transactionData: { errorMessage: "Cannot transfer to same account" },
      });
      return;
    }

    const cleanedAccountName = selectedAccount.accountName
      .replace(/\s+/g, " ")
      .trim();

    const payload = {
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
      destinationInstitutionCode: "000525",
      mandateReferenceNumber: `MA-${nameEnquiryResult.data?.data.cod_acct_no}-20260102-12345`,
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

    setPendingTransferData(payload);
    // console.log("Prepared transfer payload:", payload);
    setShowOtpModal(true);
    setOtp(["", "", "", "", "", ""]);
  };

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Validate OTP then send transfer
 const handleValidateAndTransfer = async () => {
   const token = otp.join("");
   if (token.length !== 6) {
     toast({
       title: "Invalid Token",
       description: "Please enter all 6 digits",
       variant: "destructive",
     });
     return;
   }

 
   setIsValidatingOtp(true);

   try {
     const response = await validateOtp({
       token,
       userName: userData?.userRec?.puserName || "",
     });

     if (response.success || response.ResponseCode === "90000") {
       // ADD THIS TOAST — this was missing!
       toast({
         title: "Token Validated",
         description: "Processing your transfer...",
       });

       // Now proceed to transfer
       toast({
  title: "OTP Verified",
  description: "Completing your transfer...",
});
       setIsProcessingTransfer(true);
       mutate(pendingTransferData);
     } else {
       toast({
         title: "Invalid Token",
         description:
           response.message || response.retMsg || "Token is incorrect",
         variant: "destructive",
       });
     }
   } catch (err) {
     toast({
       title: "Validation Failed",
       description: "Unable to validate token. Please try again.",
       variant: "destructive",
     });
   } finally {
     setIsValidatingOtp(false);
   }
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
          onSubmit={handleSubmit(handleConfirmTransfer)}
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
                disabled={isLoadingNameEnquiry}
              >
                {isLoadingNameEnquiry ? "Loading..." : "Next"}
              </Button>
            )}

            {step === 3 && (
              <>
                <Button type="button" onClick={previousStep} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="ml-auto">
                  Confirm Transfer
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-4">
              Token Required
            </h3>
            <p className="text-center text-muted-foreground mb-8">
              Enter the 6-digit token from your bank's token app
            </p>

            <div className="flex gap-3 justify-center mb-10">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  maxLength={1}
                  className="w-14 h-14 text-2xl font-bold text-center"
                  type="text"
                  inputMode="numeric"
                  disabled={isValidatingOtp || isProcessingTransfer}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp(["", "", "", "", "", ""]);
                  setPendingTransferData(null);
                }}
                disabled={isValidatingOtp || isProcessingTransfer}
              >
                Cancel
              </Button>
              <Button
                onClick={handleValidateAndTransfer}
                disabled={
                  otp.join("").length !== 6 ||
                  isValidatingOtp ||
                  isProcessingTransfer
                }
              >
                {isValidatingOtp
                  ? "Validating..."
                  : isProcessingTransfer
                  ? "Processing..."
                  : "Validate & Transfer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        transactionData={modalState.transactionData}
      />
    </main>
  );
}
