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

const airtimeSchema = z.object({
  account: z.string().min(1, "Please select an account"),
  networkProvider: z.string().min(1, "Please select a network provider"),
  customerMobile: z
    .string()
    .regex(
      /^0[789][01]\d{8}$/,
      "Valid Nigerian mobile number (e.g. 08012345678)"
    ),
  amount: z
    .string()
    .min(1, "Amount required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 50, "Minimum ₦50")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) <= 100000,
      "Maximum ₦100,000"
    ),
});

type AirtimeFormValues = z.infer<typeof airtimeSchema>;

export default function AirtimePayment() {
  const { toast } = useToast();
  const { userData } = appStore();

  const [airtimeBillers, setAirtimeBillers] = useState<any[]>([]);
  const [paymentItems, setPaymentItems] = useState<any[]>([]);
  const [nibssServices, setNibssServices] = useState<any[]>([]);

  const [loadingBillers, setLoadingBillers] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [pendingTransaction, setPendingTransaction] = useState<
    (AirtimeFormValues & { paymentCode: string; amountKobo: number }) | null
  >(null);

  const userName = userData?.userRec?.puserName || "";

  const form = useForm<AirtimeFormValues>({
    resolver: zodResolver(airtimeSchema),
    defaultValues: {
      account: "",
      networkProvider: "",
      customerMobile: "",
      amount: "",
    },
  });

  const selectedBillerId = form.watch("networkProvider");

  // Load NIBSS services (to get Airtime service code)
  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await getServices();
        setNibssServices(services || []);
      } catch (err) {
        console.error("Failed to load NIBSS services:", err);
      }
    };
    loadServices();
  }, []);

  // Fetch only AIRTIME billers
  useEffect(() => {
    const fetchBillers = async () => {
      setLoadingBillers(true);
      try {
        const response = await getMobileRechargeBillers();
        if (response.ResponseCode !== "90000")
          throw new Error("Failed to load billers");

        const rawBillers = response.BillerList.Category[0].Billers || [];

        const excludeKeywords = [
          "data",
          "bundle",
          "waec",
          "postpaid",
          "form",
          "pin",
          "voucher",
          "test",
          "idevworks",
          "demmy",
          "dtone",
          "ntel",
          "visafone",
        ];

        const airtimeOnly = rawBillers.filter(
          (b: any) =>
            !excludeKeywords.some((kw) => b.Name.toLowerCase().includes(kw))
        );

        airtimeOnly.sort((a: any, b: any) => a.Name.localeCompare(b.Name));
        setAirtimeBillers(airtimeOnly);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load network providers",
          variant: "destructive",
        });
      } finally {
        setLoadingBillers(false);
      }
    };

    fetchBillers();
  }, [toast]);

  // Fetch payment items (for preferred paymentCode)
  useEffect(() => {
    if (!selectedBillerId) {
      setPaymentItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const response = await getBillerPaymentItems(selectedBillerId);
        if (response.ResponseCode === "90000") {
          setPaymentItems(response.PaymentItems || []);
        } else {
          setPaymentItems([]);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Unable to load airtime options",
          variant: "destructive",
        });
        setPaymentItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [selectedBillerId, toast]);

  // Get best paymentCode for variable amount airtime
  const getPreferredPaymentCode = () => {
    if (paymentItems.length === 0) return null;

    // Prefer open/variable amount item
    const openItem = paymentItems.find(
      (item: any) =>
        item.Amount === "0" || !item.IsAmountFixed || item.AmountType !== 1
    );

    return openItem?.PaymentCode || paymentItems[0]?.PaymentCode || null;
  };

  const preferredPaymentCode = getPreferredPaymentCode();

  // Accounts query (unchanged)
  const { data: accountData, isLoading: isLoadingAccounts } = useQuery({
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
          return ReturnAcctDetails2(userRec, payload);
        }
      );

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

  const accounts = accountData?.success
    ? accountData.data
    : userData?.acctCollection || [];

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

  const onSubmit = (values: AirtimeFormValues) => {
    if (!preferredPaymentCode) {
      toast({
        title: "Error",
        description: "No valid airtime recharge option for this network",
        variant: "destructive",
      });
      return;
    }

    setPendingTransaction({
      ...values,
      paymentCode: preferredPaymentCode,
      amountKobo: Number(values.amount) * 100,
    });

    setShowOtpModal(true);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleValidateOtp = async () => {
    const token = otp.join("");
    if (token.length !== 6) {
      toast({
        title: "Invalid Token",
        description: "Enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingOtp(true);

    try {
      const otpResponse = await validateOtp({ token, userName });
      if (otpResponse.success || otpResponse.retVal === 0 || otpResponse.retMsg === "Code verified successfully") {
        await processAirtimePurchase();
      } else {
        toast({
          title: "Invalid Token",
          description: otpResponse.message || "Incorrect token",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Validation Failed",
        description: err?.response?.data?.message || "Could not validate token",
        variant: "destructive",
      });
    } finally {
      setIsValidatingOtp(false);
    }
  };

  const processAirtimePurchase = async () => {
    if (!pendingTransaction || !preferredPaymentCode) return;
    setIsProcessingPayment(true);

    try {
      const airtimeService = nibssServices.find((s: any) =>
        s.service_name?.toLowerCase().includes("airtime")
      );

      if (!airtimeService || airtimeService.status !== "A") {
        throw new Error("Airtime service is currently unavailable");
      }

      const requestReference = generateISWPaymentRef();

      const payload = {
        debitAccountNumber: pendingTransaction.account,
        serviceCode: airtimeService.service_code,
        mobileNumber: pendingTransaction.customerMobile,
        paymentCode: pendingTransaction.paymentCode,
        customerId: pendingTransaction.customerMobile,
        customerMobile: pendingTransaction.customerMobile,
        customerEmail: userData?.userRec?.email || "noemail@nomase.com",
        amount: pendingTransaction.amountKobo, // in kobo
        requestReference,
        createdAt: new Date().toISOString(),
        status: airtimeService.status,
      };

      console.log("Airtime Purchase Payload:", payload);

      const response = await BuyAirtimeData(payload);

      const success =
        response.success ||
        response.ResponseCode === "90000" ||
        response.responseCode === "00" ||
        response.status?.toLowerCase() === "success";

      if (success) {
        toast({
          title: "Success!",
          description: `₦${pendingTransaction.amount} airtime sent to ${pendingTransaction.customerMobile}`,
        });

        form.reset();
        setShowOtpModal(false);
        setPendingTransaction(null);
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast({
          title: "Failed",
          description:
            response.message ||
            response.responseMessage ||
            "Transaction failed",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Airtime purchase failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className="h-full w-full flex flex-col gap-8 items-center justify-center p-6">
      <h2 className="text-2xl font-bold">Buy Airtime</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md border border-border rounded-lg p-8 bg-card"
        >
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
                      <SelectItem
                        key={acct.accountNumber}
                        value={acct.accountNumber}
                      >
                        {acct.accountNumber} -{" "}
                        {formatCurrency(Number(acct.availBal))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Network */}
          <FormField
            control={form.control}
            name="networkProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingBillers}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingBillers ? "Loading..." : "Select network"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {airtimeBillers.map((biller) => (
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

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₦)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="500" min="50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loadingBillers || loadingItems || !preferredPaymentCode}
          >
            Buy Airtime
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
                disabled={
                  otp.join("").length !== 6 ||
                  isValidatingOtp ||
                  isProcessingPayment
                }
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
