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
// import { ReturnAcctDetails2 } from '@/services/apiAuth'; // ⛔️ COMMENTED OUT

export default function Dashboard() {
  const { userData, appData } = appStore();

  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

  useEffect(() => {
    if (userData?.acctCollection) {
      setSelectedAccount(userData.acctCollection[0] || null);
    }
  }, [userData]);

  const selectAccountByNumber = (accountNumber: string) => {
    const selected = userData.acctCollection.find(
      (account: { accountNumber: string }) =>
        account.accountNumber === accountNumber
    );
    setSelectedAccount(selected);
  };

  console.log("User Data Returned", userData);
  console.log("App Data", appData);

  const advertImages: string[] = [
    "https://images.unsplash.com/photo-1719937050445-098888c0625e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1725714835081-118a2b0456b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1726134212431-c794fd3d0c34?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  if (!userData || !userData.acctCollection) return <Loading />;

  return (
    <main className="h-full w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        Welcome, {userData?.userRec?.pfullName}
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
              {/* {selectedAccount
                ? formatCurrency(selectedAccount?.availBal)
                : "0.00"} */}
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
                {userData.acctCollection.map((account: any, index: number) => (
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
