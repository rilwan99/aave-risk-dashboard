"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import TransactionBarChart from "@/components/ui/chart";
import { MetricsTable } from "@/components/metrics-table";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const data = {
    totalSupply: "12,343,432 USD",
    totalBorrow: "1,144,123 USD",
    tvl: "10,943,342 USD",
    totalGasInUsd: "$USD 43234",
    uniqueAccountsInteracted: 1322,
    accountType: "Program Accounts",
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-top p-8 w-full gap-y-3">
      <div className="flex w-full justify-start items-end">
        <h4 className="text-3xl font-semibold mr-4">AAVE Risk Dashboard</h4>
        <p>12-01-2024 13:43:24 hrs</p>
      </div>
      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-10">
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Supply</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.totalSupply}</CardTitle>
              )}
            </CardHeader>
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Borrow</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.totalBorrow}</CardTitle>
              )}
            </CardHeader>
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Value Locked</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{data.tvl}</CardTitle>
              )}{" "}
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="w-full mt-5">
        <MetricsTable />
      </div>
    </main>
  );
}
