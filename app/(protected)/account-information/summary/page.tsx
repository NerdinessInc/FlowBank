"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { formatCurrency } from "@/utils/formatNumber";
import { ReturnAcctDetails2 } from "@/services/apiAuth";
import { appStore } from "@/store";

interface AccountDetail {
  accountNumber: string;
  accountTitle: string;
  description: string;
  bookBalance: number;
  availableBalance: number;
  currency: string;
  accountType: "Current" | "Savings";
}

export default function AccountSummary() {
  const { userData } = appStore();
  const [accounts, setAccounts] = useState<AccountDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!userData?.userRec || !userData?.acctCollection?.length) {
        setIsLoading(false);
        setError("No accounts found.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const userRec = {
          accCode: (userData.userRec as any).accCode || userData.userRec.pAcessCode || "",
          puserName: (userData.userRec as any).puserName || userData.userRec.pUserName || "",
        };

        const fetchPromises = userData.acctCollection.map(async (acct: any) => {
          const payload = [
            {
              customerID: acct.customerID,
              accountNumber: acct.accountNumber,
            },
          ];

          try {
            const response = await ReturnAcctDetails2(userRec, payload);

            console.log(`Response for ${acct.accountNumber}:`, response);

            if (response?.success === true && response?.data?.length > 0) {
              const apiAccount = response.data[0];

              return {
                accountNumber: apiAccount.accountNumber || acct.accountNumber,
                accountTitle: apiAccount.description || "Unknown Account", // Use description as title
                description: apiAccount.description || "",
                bookBalance: Number(apiAccount.bookBalance) || 0,
                availableBalance: Number(apiAccount.availBal) || 0, // Correct field
                currency: apiAccount.currency || "NAIRA",
                accountType: apiAccount.type === "Current" ? "Current" : "Savings", // Direct mapping
              } as AccountDetail;
            } else {
              console.warn(`No data for account ${acct.accountNumber}`);
              // Fallback to stored data if available
              return {
                accountNumber: acct.accountNumber,
                accountTitle: acct.accountName || "N/A",
                description: "Details unavailable",
                bookBalance: 0,
                availableBalance: acct.availBal || 0,
                currency: acct.namCurrency || "NAIRA",
                accountType: acct.codAcctType === "CK" ? "Current" : "Savings",
              } as AccountDetail;
            }
          } catch (err) {
            console.error(`Error fetching ${acct.accountNumber}:`, err);
            return {
              accountNumber: acct.accountNumber,
              accountTitle: acct.accountName || "Error",
              description: "Failed to load",
              bookBalance: 0,
              availableBalance: acct.availBal || 0,
              currency: acct.namCurrency || "NAIRA",
              accountType: acct.codAcctType === "CK" ? "Current" : "Savings",
            } as AccountDetail;
          }
        });

        const fetchedAccounts = await Promise.all(fetchPromises);
        setAccounts(fetchedAccounts);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setError("Unable to load account details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountDetails();
  }, [userData]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No accounts available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Accounts Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Number</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Ledger Balance</TableHead>
                <TableHead className="text-right">Available Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.accountNumber}>
                  <TableCell className="font-medium">
                    {account.accountNumber}
                  </TableCell>
                  <TableCell>{account.accountTitle}</TableCell>
                  <TableCell>{account.currency}</TableCell>
                  <TableCell>
                    {account.accountType === "Current" ? "Current Account" : "Savings Account"}
                  </TableCell>
                  <TableCell  className="text-right">
                    {formatCurrency(account.bookBalance)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {formatCurrency(account.availableBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}