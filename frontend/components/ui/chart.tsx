"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Jan", transactions: 100 },
  { week: "Feb", transactions: 150 },
  { week: "Mar", transactions: 200 },
  { week: "Apr", transactions: 180 },
  { week: "May", transactions: 200 },
  { week: "Jun", transactions: 170 },
  { week: "Jul", transactions: 190 },
  { week: "Aug", transactions: 180 },
  { week: "Sep", transactions: 215 },
  { week: "Oct", transactions: 195 },
  { week: "Nov", transactions: 230 },
  { week: "Dec", transactions: 205 },
];

const TransactionBarChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("/api/chart");
  //       const result = await response.json();
  //       setData(result);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Failed to fetch data");
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis
            dataKey="week"
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="transactions" fill="#e8e6e6" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionBarChart;
