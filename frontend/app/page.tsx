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
// import dummyData from '@/data.json';


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [blockNumber, setBlockNumber] = useState("");

  const [reserveData, setReserveData] = useState([]);
  const [totalSupply, setTotalSupply] = useState("");
  const [totalBorrow, setTotalBorrow] = useState("")
  const [totalValueLocked, setTotalValueLocked] = useState("")

  const fetchTimestamp = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/timestamp");
      const result = await response.json();
      setTimestamp(new Date(result.timestamp * 1000).toLocaleString());
      setBlockNumber(result.blockNumber);
    } catch (error) {
      console.error("Failed to fetch the timestamp:", error);
      setTimestamp("Failed to load timestamp");
      setBlockNumber("Failed to load block number");
    } finally {
      setLoading(false);
    }
  };

  const fetchReserveData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/overview");
      const result = await response.json();
      console.log('result: ')
      console.log(result)


      setReserveData(result.reserveData)
      setTotalSupply(result.totals.totalSupply)
      setTotalBorrow(result.totals.totalBorrow)
      setTotalValueLocked(result.totals.totalValueLocked)

 
    } catch (error) {
      console.error("Failed to fetch the reserve Data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTimestamp();
    fetchReserveData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-top p-8 w-full gap-y-3">
      <div className="flex flex-row w-full justify-between space-x-4">
        <div className="flex flex-col items-start space-y-2">
          <h4 className="text-3xl font-semibold">AAVE Risk Dashboard</h4>
          <p className="text-blue-400">
            As of:{" "}
            <span className="font-medium">
              {loading ? "Loading..." : timestamp}
            </span>
          </p>
          <p className="text-blue-400">
            Latest block:{" "}
            <span className="font-medium">
              {loading ? "Loading..." : blockNumber}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center pr-4">
          <p className="text-xl font-medium">AAVE-v3</p>
          <img src="/ethereum.svg" alt="AAVE Logo" className="h-20 w-30" />
        </div>
      </div>

      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-10">
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Supply</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{totalSupply}</CardTitle>
              )}
            </CardHeader>
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Borrow</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{totalBorrow}</CardTitle>
              )}
            </CardHeader>
          </Card>
          <Card className="w-[250px]">
            <CardHeader>
              <CardDescription>Total Value Locked</CardDescription>
              {loading ? (
                <Skeleton className="w-[150px] h-[20px]" />
              ) : (
                <CardTitle>{totalValueLocked}</CardTitle>
              )}{" "}
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="w-full mt-5">
        <MetricsTable reserveData={reserveData}/>
      </div>
    </main>
  );
}
