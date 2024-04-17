"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionBarChart from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState(null);

  const data = {
    period: "01/03 - 23/03",
    numberOfTransactions: 19423,
    transactionStatus: "Finalized",
    totalGasSpent: "13244 SOL",
    totalGasInUsd: "$USD 43234",
    uniqueAccountsInteracted: 1322,
    accountType: "Program Accounts",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/overview");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-top p-8 w-full gap-y-3">
      <div className="flex gap-x-4 w-full justify-between">
        <h4 className="text-3xl font-semibold mb-2">Dashboard</h4>

        <div className="flex items-center space-x-2 w-[35%]">
          <Input
            type="email"
            placeholder="Search by Contract Address"
            disabled
          />
          <Button type="submit" disabled>
            Coming soon..
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <div>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Period</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.period}</CardTitle>
              )}
            </CardHeader>
          </Card>
        </div>

        <div className="flex gap-x-5">
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Number of Transactions</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.numberOfTransactions}</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                data.transactionStatus
              )}
            </CardContent>
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Gas Spent</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.totalGasSpent}</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                data.totalGasInUsd
              )}
            </CardContent>{" "}
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Unique accounts interacted</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.uniqueAccountsInteracted}</CardTitle>
              )}{" "}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                data.accountType
              )}
            </CardContent>{" "}
          </Card>
        </div>
      </div>
      <div className="flex w-full gap-x-5">
        <div className="w-[60%]">
          <Card className="pt-2 pr-2">
            <CardContent>Transactions</CardContent>
            <TransactionBarChart />
          </Card>
        </div>
        <div className="w-[40%]">
          <Card className="p-2">
            <CardHeader className="pt-1">
              <CardContent className="p-0">Top accounts</CardContent>
              <CardDescription>
                Accounts with the most transactions
              </CardDescription>
            </CardHeader>

            <div className="flex flex-col w-full gap-y-3">
              <div className="flex w-full justify-between">
                <p>program/ User</p>
                <p>Account address</p>
                <p>Number of transactions</p>
              </div>
              <div className="flex w-full justify-between">
                <p>program/ User</p>
                <p>Account address</p>
                <p>Number of transactions</p>
              </div>
              <div className="flex w-full justify-between">
                <p>program/ User</p>
                <p>Account address</p>
                <p>Number of transactions</p>
              </div>
              <div className="flex w-full justify-between">
                <p>program/ User</p>
                <p>Account address</p>
                <p>Number of transactions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-5"></div>
    </main>
  );
}
