"use client";

import { useEffect, useState, useMemo } from "react";
import { appStore } from "@/store";
import { getTransferHistory } from "@/services/apiAuth";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/formatNumber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/Loader";

const formatValueDate = (valueDate: number[] | null) => {
  if (!valueDate || valueDate.length < 6) return "N/A";
  const [year, month, day, hour, minute, second] = valueDate;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const TransferHistory = () => {
  const { userData } = appStore();
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (userData?.acctCollection?.[0]?.accountNumber) {
      setAccountNumber(userData.acctCollection[0].accountNumber);
    }
  }, [userData]);

  const {
    data: transferHistory = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transfer-history", accountNumber],
    queryFn: () => getTransferHistory(accountNumber),
    enabled: !!accountNumber,
    staleTime: 5 * 60 * 1000,
  });

  const transfers = transferHistory?.data ?? [];

  // Create reversed version without mutating original
  const sortedTransfers = useMemo(() => {
    return [...transfers].reverse();
  }, [transfers]);


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

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-background h-[100vh]">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-10">Transfer History</h2>

        {transferHistory.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              No transfer history found for this account.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {sortedTransfers.map((transfer: any, index: number) => {
              const isOutgoing = transfer?.originatorAccountNumber === accountNumber;
              const isSuccessful = transfer?.responseCode === "Posted";

              return (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    isSuccessful
                      ? "border-l-green-500"
                      : "border-l-yellow-500"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span className="font-semibold">
                        {isOutgoing ? "Sent" : "Received"}
                      </span>
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
                          ? transfer.beneficiaryAccountName
                          : transfer.originatorAccountName}
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
                        {transfer.paymentReference}
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
        )}
      </div>
    </main>
  );
};

export default TransferHistory;