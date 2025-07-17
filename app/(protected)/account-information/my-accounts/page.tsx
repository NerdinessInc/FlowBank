"use client";

// query
import { useQuery } from "@tanstack/react-query";

// components
import { Loading } from "@/components/Loader";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// store
import { appStore } from "@/store";

// services
import { ReturnAcctDetails2 } from "@/services/api";

export default function MyAccounts() {
  const { userData } = appStore();

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>My Accounts</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Number</TableHead>
                <TableHead>Account Title</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {userData?.acctCollection?.map((account: any, index: number) => (
                <TableRow key={index} className="cursor-pointer">
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell>{account.namCurrency}</TableCell>
                  <TableCell>
                    {account.codAcctType === "CK"
                      ? "Current Account"
                      : "Savings Account"}
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
