import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reserveData = [
  {
    tokenName: "Wrapped ETH",
    tokenSymbol: "WETH",
    supplyAmount: 1234,
    supplyValue: 2231423,
    supplyCap: 5000,
    supplyLimitUsed: 0.5,
    borrowAmount: 243,
    borrowValue: 213234,
    borrowCap: 1000,
    borrowLimitUsed: 0.76,
    ltv: 0.75,
    liquidationThreshold: 0.85,
    utilizationRate: 0.5,
  },
  {
    tokenName: "Bitcoin",
    tokenSymbol: "BTC",
    supplyAmount: 543,
    supplyValue: 21500000,
    supplyCap: 21000000,
    supplyLimitUsed: 0.3,
    borrowAmount: 50,
    borrowValue: 1950000,
    borrowCap: 500,
    borrowLimitUsed: 0.90,
    ltv: 0.5,
    liquidationThreshold: 0.7,
    utilizationRate: 0.45,
  },
  {
    tokenName: "Dai Stablecoin",
    tokenSymbol: "DAI",
    supplyAmount: 10000,
    supplyValue: 10000000,
    supplyCap: 100000,
    supplyLimitUsed: 0.9,
    borrowAmount: 5000,
    borrowValue: 5000000,
    borrowCap: 15000,
    borrowLimitUsed: 0.76,
    ltv: 0.8,
    liquidationThreshold: 0.9,
    utilizationRate: 0.8,
  },
];
const aggregatedData = {
  totalSupplyValue: 33123421,
  totalBorrowValue: 6453532,
};

export function MetricsTable() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  const formatPercentage = (ratio) => {
    return `${(ratio * 100).toFixed(2)}%`;
  };
  const getPercentageClass = (percentage) => {
    const value = parseFloat((percentage * 100).toFixed(2));
    if (value >= 80) return 'text-red-600';
    if (value <= 50) return 'text-green-600';
  };

  return (
    <Table>
      <TableCaption>On-chain data displaying key risk metrics</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Token Name/ Symbol</TableHead>
          <TableHead>LTV</TableHead>
          <TableHead>Liquidation Threshold</TableHead>
          <TableHead>Utilization Rate</TableHead>
          <TableHead>Supply Amount</TableHead>
          <TableHead>Supply Value</TableHead>
          <TableHead>Supply Cap</TableHead>
          <TableHead>Supply Limit Used</TableHead>
          <TableHead>Borrow Amount</TableHead>
          <TableHead>Borrow Value</TableHead>
          <TableHead>Borrow Cap</TableHead>
          <TableHead>Borrow Limit Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reserveData.map((item) => (
          <TableRow key={item.tokenSymbol}>
            {" "}
            <TableCell>{`${item.tokenName} (${item.tokenSymbol})`}</TableCell>
            <TableCell>{formatPercentage(item.ltv)}</TableCell>
            <TableCell>{formatPercentage(item.liquidationThreshold)}</TableCell>
            <TableCell className={getPercentageClass(item.utilizationRate)}>{formatPercentage(item.utilizationRate)}</TableCell>
            <TableCell>{item.supplyAmount}</TableCell>
            <TableCell>{formatCurrency(item.supplyValue)}</TableCell>
            <TableCell>{item.supplyCap}</TableCell>
            <TableCell className={getPercentageClass(item.supplyLimitUsed)}>{formatPercentage(item.supplyLimitUsed)}</TableCell>
            <TableCell>{item.borrowAmount}</TableCell>
            <TableCell>{formatCurrency(item.borrowValue)}</TableCell>
            <TableCell>{item.borrowCap}</TableCell>
            <TableCell className={getPercentageClass(item.borrowLimitUsed)}>{formatPercentage(item.borrowLimitUsed)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell>{formatCurrency(aggregatedData.totalSupplyValue)}</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{formatCurrency(aggregatedData.totalBorrowValue)}</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{" "}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
