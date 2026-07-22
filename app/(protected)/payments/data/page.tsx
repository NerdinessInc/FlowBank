"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ReturnAcctDetails2 } from "@/services/apiAuth";

import {
  getMobileRechargeBillers,
  getBillerPaymentItems,
  BuyAirtimeData,
  getServices,
  validateOtp,
} from "@/services/apiAuth";
import { generateISWPaymentRef } from "@/utils/generateISWpaymentref";
import { appStore } from "@/store";
import { formatCurrency } from "@/utils/formatNumber";

const dataSchema = z.object({
  account: z.string().min(1, "Please select an account"),
  networkProvider: z.string().min(1, "Please select a network provider"),
  customerMobile: z
    .string()
    .regex(/^0[789][01]\d{8}$/, "Valid Nigerian mobile number (e.g. 08012345678)"),
  dataPlan: z.string().min(1, "Please select a data plan"),
});

type DataFormValues = z.infer<typeof dataSchema>;

export default function DataPayment() {
  const { toast } = useToast();
  const { userData } = appStore();

  const [dataBillers, setDataBillers] = useState<any[]>([]);
  const [dataPlans, setDataPlans] = useState<any[]>([]);
  const [nibssServices, setNibssServices] = useState<any[]>([]);
  const [loadingBillers, setLoadingBillers] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [pendingTransaction, setPendingTransaction] = useState<
    (DataFormValues & { paymentCode: string; amountKobo: number }) | null
  >(null);

  const form = useForm<DataFormValues>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      account: "",
      networkProvider: "",
      customerMobile: "",
      dataPlan: "",
    },
  });

  const selectedBillerId = form.watch("networkProvider");

  // Load username (for OTP)
  const userName = userData?.userRec?.puserName || "";

  // Fetch accounts (same as before)
  const {
    data: accountData,
    isLoading: isLoadingAccounts,
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

      const accountPromises = userData.acctCollection.map(async (account: any) => {
        const payload = [
          {
            customerId: account.customerID,
            accountNumber: account.accountNumber,
          },
        ];
        const response = await ReturnAcctDetails2(userRec, payload);
        return response;
      });

      const responses = await Promise.all(accountPromises);

      const accounts = responses.flatMap((response, index) => {
        if (response.success && response.data) {
          return response.data.map((acct: any) => ({
            accountNumber: acct.accountNumber,
            accountName: acct.description,
            availBal: acct.availBal,
            namCurrency: acct.currency,
            codAcctType: acct.type === "Current" ? "CK" : "SV",
            CustomerID: userData.acctCollection[index].CustomerID,
          }));
        }
        return [userData.acctCollection[index]];
      });

      return { success: true, data: accounts };
    },
    enabled: !!userData?.userRec && !!userData?.acctCollection?.length,
  });

  const accounts = accountData?.success ? accountData.data : userData?.acctCollection || [];

  // Load NIBSS services (to get Data service code)
  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await getServices();
        setNibssServices(services || []);
      } catch (err) {
        console.error("Failed to load NIBSS services", err);
      }
    };
    loadServices();
  }, []);

  // Fetch only DATA billers
  useEffect(() => {
    const fetchDataBillers = async () => {
      setLoadingBillers(true);
      try {
        const response = await getMobileRechargeBillers();
        if (response.ResponseCode !== "90000") throw new Error("Failed to load billers");

        const rawBillers = response.BillerList.Category[0].Billers || [];
        const dataBillersOnly = rawBillers.filter((b: any) =>
          /data|bundle/i.test(b.Name)
        );

        dataBillersOnly.sort((a: any, b: any) => a.Name.localeCompare(b.Name));
        setDataBillers(dataBillersOnly);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data providers",
          variant: "destructive",
        });
      } finally {
        setLoadingBillers(false);
      }
    };

    fetchDataBillers();
  }, [toast]);

  // Fetch plans when network changes
  useEffect(() => {
    if (!selectedBillerId) {
      setDataPlans([]);
      return;
    }

    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await getBillerPaymentItems(selectedBillerId);
        if (response.ResponseCode === "90000" && response.PaymentItems) {
          const plans = response.PaymentItems.filter((item: any) =>
            /data|gb|mb|bundle/i.test(item.Name)
          );
          setDataPlans(plans);
        } else {
          setDataPlans([]);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Unable to load data plans",
          variant: "destructive",
        });
        setDataPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [selectedBillerId, toast]);

  // OTP handlers
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

  const onSubmit = (values: DataFormValues) => {
    const selectedPlan = dataPlans.find((p: any) => p.PaymentCode === values.dataPlan);
    if (!selectedPlan) return;

    setPendingTransaction({
      ...values,
      paymentCode: selectedPlan.PaymentCode,
      amountKobo: Number(selectedPlan.Amount), // already in kobo usually
    });

    setShowOtpModal(true);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleValidateOtp = async () => {
    const token = otp.join("");
    if (token.length !== 6) {
      toast({ title: "Invalid Token", description: "Enter all 6 digits", variant: "destructive" });
      return;
    }

    setIsValidatingOtp(true);

    try {
      const otpResponse = await validateOtp({ token, userName });
      if (otpResponse.success || otpResponse.retVal === 0 || otpResponse.retMsg === "Code verified successfully") {
        await processDataPurchase();
      } else {
        toast({
          title: "Invalid Token",
          description: otpResponse.message || "Token is incorrect",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Validation Failed",
        description: err?.response?.data?.message || "Unable to validate token",
        variant: "destructive",
      });
    } finally {
      setIsValidatingOtp(false);
    }
  };

  const processDataPurchase = async () => {
    if (!pendingTransaction) return;
    setIsProcessingPayment(true);

    try {
      const dataService = nibssServices.find((s: any) =>
        s.service_name?.toLowerCase().includes("data")
      );

      if (!dataService || dataService.status !== "A") {
        throw new Error("Data service is currently unavailable");
      }

      const requestReference = generateISWPaymentRef();

      const payload = {
        debitAccountNumber: pendingTransaction.account,
        serviceCode: dataService.service_code,
        mobileNumber: pendingTransaction.customerMobile,
        paymentCode: pendingTransaction.paymentCode,
        customerId: pendingTransaction.customerMobile, // or real customer ID if available
        customerMobile: pendingTransaction.customerMobile,
        customerEmail: userData?.userRec?.email || "noemail@gmail.com",
        amount: pendingTransaction.amountKobo, // in kobo
        requestReference,
        createdAt: new Date().toISOString(),
        status: dataService.status,
      };

      console.log("Data Purchase Payload:", payload);

      const response = await BuyAirtimeData(payload);

      const success =
        response.success ||
        response.ResponseCode === "90000" ||
        response.responseCode === "00" ||
        response.status?.toLowerCase() === "success";

      if (success) {
        const planName =
          dataPlans.find((p) => p.PaymentCode === pendingTransaction.paymentCode)?.Name ||
          "Data Bundle";

        toast({
          title: "Success!",
          description: `${planName} (₦${(pendingTransaction.amountKobo / 100).toLocaleString()}) purchased successfully`,
        });

        form.reset();
        setShowOtpModal(false);
        setPendingTransaction(null);
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast({
          title: "Purchase Failed",
          description: response.message || response.responseMessage || "Transaction failed",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Data purchase failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className="h-full w-full flex flex-col gap-8 items-center justify-center p-6">
      <h2 className="text-2xl font-bold">Buy Data Bundle</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md border border-border rounded-lg p-8 bg-card">
          {/* Debit Account */}
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay From</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accounts?.map((acct: any) => (
                      <SelectItem key={acct.accountNumber} value={acct.accountNumber}>
                        {acct.accountNumber} - {formatCurrency(Number(acct.availBal))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Network Provider */}
          <FormField
            control={form.control}
            name="networkProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Provider</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={loadingBillers}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingBillers ? "Loading..." : "Select provider"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataBillers.map((biller) => (
                      <SelectItem key={biller.Id} value={biller.Id.toString()}>
                        {biller.Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="customerMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="08012345678" maxLength={11} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data Plan */}
          <FormField
            control={form.control}
            name="dataPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Plan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingPlans || dataPlans.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingPlans
                            ? "Loading plans..."
                            : dataPlans.length === 0
                            ? "Select provider first"
                            : "Choose plan"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dataPlans.map((plan: any) => (
                      <SelectItem key={plan.PaymentCode} value={plan.PaymentCode}>
                        {plan.Name} • ₦{Number(plan.Amount / 100).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loadingBillers || loadingPlans || dataPlans.length === 0}
          >
            Buy Data
          </Button>
        </form>
      </Form>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-center mb-3">Enter OTP</h3>
            <p className="text-center text-muted-foreground mb-8">
              A 6-digit code has been sent to your registered phone
            </p>

            <div className="flex gap-4 justify-center mb-10">
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
                  disabled={isValidatingOtp || isProcessingPayment}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp(["", "", "", "", "", ""]);
                  setPendingTransaction(null);
                }}
                disabled={isValidatingOtp || isProcessingPayment}
              >
                Cancel
              </Button>
              <Button
                onClick={handleValidateOtp}
                disabled={otp.join("").length !== 6 || isValidatingOtp || isProcessingPayment}
              >
                {isValidatingOtp
                  ? "Validating..."
                  : isProcessingPayment
                  ? "Processing..."
                  : "Confirm & Buy"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}