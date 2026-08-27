"use client";

import { useMemo } from "react";
import { appStore } from "@/store";
import { getTransferHistory } from "@/services/apiAuth";
import { useQueries } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/formatNumber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/Loader";

interface TransferItem {
  valueDate?: number[];
  amount: number;
  originatorAccountNumber?: string;
  originatorAccountName?: string;
  beneficiaryAccountNumber?: string;
  beneficiaryAccountName?: string;
  paymentReference?: string;
  originatorNarration?: string;
  beneficiaryNarration?: string;
  responseCode?: string;
  sourceAccountNumber?: string;
}

const formatValueDate = (valueDate: number[] | undefined) => {
  if (!valueDate || valueDate.length < 6) return "—";

  const [year, month, day, hour, minute, second] = valueDate;

  let date = new Date(year, month - 1, day, hour, minute, second || 0);

  if (isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  // Correct future dates to 2025 (for display)
  if (date > now) {
    date = new Date(2025, month - 1, day, hour, minute, second || 0);
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Helper to get corrected timestamp for sorting
const getCorrectedTimestamp = (valueDate?: number[]): number => {
  if (!valueDate || valueDate.length < 6) return 0;

  const [year, month, day, hour, minute, second] = valueDate;
  let date = new Date(year, month - 1, day, hour, minute, second || 0);

  if (isNaN(date.getTime())) return 0;

  const now = new Date();
  if (date > now) {
    date = new Date(2025, month - 1, day, hour, minute, second || 0);
  }

  return date.getTime();
};

const TransferHistory = () => {
  const { userData } = appStore();

  const accounts = userData?.acctCollection || [];
  const accountNumbers = accounts
    .map((acc: any) => acc?.accountNumber)
    .filter(Boolean);

  const queries = useQueries({
    queries: accountNumbers.map((accountNumber: string) => ({
      queryKey: ["transfer-history", accountNumber],
      queryFn: () => getTransferHistory(accountNumber as any),
      enabled: !!accountNumber,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.isError)?.error;

  const allTransfers = useMemo(() => {
    const combined: TransferItem[] = [];

    queries.forEach((query, index) => {
      if (query.isSuccess && (query.data as any)?.data) {
        const accountNumber = accountNumbers[index];
        const transfers = (query.data as any).data;

        if (Array.isArray(transfers)) {
          const enriched = transfers.map((t: any) => ({
            ...t,
            sourceAccountNumber: accountNumber,
          }));

          combined.push(...enriched);
        }
      }
    });

    // Sort using the CORRECTED date (after applying 2025 fix)
    return combined.sort((a, b) => {
      const timeA = getCorrectedTimestamp(a.valueDate);
      const timeB = getCorrectedTimestamp(b.valueDate);
      return timeB - timeA; // newest first
    });
  }, [queries, accountNumbers]);

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertDescription>
          Failed to load transfer history: {error?.message || "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (allTransfers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6 bg-background">
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Transfer History
          </h2>
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              No transfer history found across all your accounts.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-background">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10">
          Transfer History
        </h2>

        {accounts.length > 1 && (
          <p className="text-center text-muted-foreground mb-6">
            Showing transactions from all accounts
          </p>
        )}

        <div className="space-y-5">
          {allTransfers.map((transfer: TransferItem, index: number) => {
            const accountNumber = transfer.sourceAccountNumber || "";
            const isOutgoing = transfer.originatorAccountNumber === accountNumber;
            const isSuccessful = transfer.responseCode === "Posted";

            return (
              <Card
                key={index}
                className={`border-l-4 ${
                  isSuccessful ? "border-l-green-500" : "border-l-yellow-500"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {isOutgoing ? "Sent" : "Received"}
                      </span>
                      {accounts.length > 1 && transfer.sourceAccountNumber && (
                        <span className="text-xs text-muted-foreground mt-1">
                          Account •••• {transfer.sourceAccountNumber.slice(-4)}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xl font-bold ${
                        isOutgoing ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isOutgoing ? "-" : "+"}
                      {formatCurrency(transfer.amount)}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {formatValueDate(transfer.valueDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      {isOutgoing ? "To" : "From"}
                    </p>
                    <p className="font-medium">
                      {isOutgoing
                        ? transfer.beneficiaryAccountName || "—"
                        : transfer.originatorAccountName || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isOutgoing
                        ? transfer.beneficiaryAccountNumber
                        : transfer.originatorAccountNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Reference</p>
                    <p className="font-mono break-all">
                      {transfer.paymentReference || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p
                      className={`font-semibold ${
                        isSuccessful ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {isSuccessful ? "Successful" : "Pending / Unposted"}
                    </p>
                  </div>

                  {(transfer.originatorNarration ||
                    transfer.beneficiaryNarration) && (
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">Narration</p>
                      <p className="italic">
                        {transfer.originatorNarration ||
                          transfer.beneficiaryNarration}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default TransferHistory;