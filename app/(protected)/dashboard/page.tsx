"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";

// icons
import { ActivitySquare, Banknote, CreditCard } from "lucide-react";

// components
import { Loading } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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

// utils
import { formatCurrency } from "@/utils/formatNumber";

// services
import { ReturnAcctDetails2 } from "@/services/apiAuth";

export default function Dashboard() {
  const { userData, appData } = appStore();
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAccounts, setUpdatedAccounts] = useState<any[]>([]);

  // Fetch account details for all accounts on mount
  useEffect(() => {
    const fetchAllAccountDetails = async () => {
      if (!userData?.userRec || !userData?.acctCollection?.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userRec = {
          accCode: userData.userRec.accCode || "",
          puserName: userData.userRec.puserName || "",
        };

        // Fetch details for each account
        const accountPromises = userData.acctCollection.map(async (account: any) => {
          const payload = [{
            customerID: account.customerID, // Adjust based on your acctCollection structure
            accountNumber: account.accountNumber,
          }];
          const response = await ReturnAcctDetails2(userRec, payload);
          return response;
        });

        const responses = await Promise.all(accountPromises);

        // Process all responses
        const newAccounts = responses.flatMap((response, index) => {
          if (response.success && response.data) {
            return response.data.map((account: any) => ({
              accountNumber: account.accountNumber,
              accountName: account.description,
              availBal: account.availBal,
              namCurrency: account.currency,
              codAcctType: account.type === "Current" ? "CK" : "SV", // Adjust based on type
              CustomerID: userData.acctCollection[index].customerID, // Preserve original data
            }));
          } else {
            console.error(
              `Failed to fetch details for account ${userData.acctCollection[index].accountNumber}:`,
              response.errorMessage
            );
            return [userData.acctCollection[index]]; // Fallback to original account data
          }
        });

        setUpdatedAccounts(newAccounts);

        // Set the first account as selected if available
        if (newAccounts.length > 0) {
          setSelectedAccount(newAccounts[0]);
        }

        // Optionally update the store if needed
        // appStore.setUserData({ ...userData, acctCollection: newAccounts });
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Something went wrong while fetching account details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAccountDetails();
  }, [userData]);

  // Fallback to userData.acctCollection if updatedAccounts is empty
  useEffect(() => {
    if (userData?.acctCollection && !selectedAccount && !updatedAccounts.length) {
      setSelectedAccount(userData.acctCollection[0] || null);
    }
  }, [userData, selectedAccount, updatedAccounts]);

  const selectAccountByNumber = (accountNumber: string) => {
    const selected = (updatedAccounts.length ? updatedAccounts : userData.acctCollection).find(
      (account: { accountNumber: string }) =>
        account.accountNumber === accountNumber
    );
    setSelectedAccount(selected);
  };

  console.log("User Data Returned", userData);
  console.log("App Data", appData);
  console.log("Updated Accounts", updatedAccounts);

  const advertImages: string[] = [
    "https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1725714835081-118a2b0456b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1726134212431-c794fd3d0c34?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!userData || !userData.acctCollection) return <Loading />;

  // Use updatedAccounts if available, else fallback to userData.acctCollection
  const accountsToDisplay = updatedAccounts.length ? updatedAccounts : userData.acctCollection;

  return (
    <main className="h-full w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        Welcome, {userData?.acctCollection[0].accountName}
      </h2>

      <div className="grid gap-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Banknote />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(selectedAccount?.availBal) || 0.0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Number
            </CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedAccount ? selectedAccount.accountNumber : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currency</CardTitle>
            <ActivitySquare />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedAccount ? selectedAccount.namCurrency : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

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
                {accountsToDisplay.map((account: any, index: number) => (
                  <TableRow
                    key={index}
                    onClick={() => selectAccountByNumber(account.accountNumber)}
                    className="cursor-pointer"
                  >
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

      <Carousel
        className="mt-4"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {advertImages.map((image, index) => (
            <CarouselItem className="relative w-full h-[300px]" key={index}>
              <div className="w-full h-full">
                <Image
                  src={image}
                  fill
                  alt={`image ${index + 1}`}
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </main>
  );
}