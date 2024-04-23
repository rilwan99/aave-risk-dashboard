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

const aggregatedData = {
  totalSupplyValue: 33123421,
  totalBorrowValue: 6453532,
};

export function MetricsTable({ reserveData }) {
  const getPercentageClass = (percentage) => {
    const value = parseFloat(percentage.replace("%", ""));

    if (value >= 80) return "text-red-600";
    if (value <= 50) return "text-green-600";
  };

  return (
    <Table>
      <TableCaption>On-chain data displaying key risk metrics</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Token</TableHead>
          <TableHead>LTV</TableHead>
          <TableHead>Liquidation Threshold</TableHead>
          <TableHead>Utilization Rate</TableHead>
          <TableHead>Supply Amount</TableHead>
          <TableHead>Supply Value (USD)</TableHead>
          <TableHead>Supply Cap</TableHead>
          <TableHead>Supply Limit Used</TableHead>
          <TableHead>Borrow Amount</TableHead>
          <TableHead>Borrow Value (USD)</TableHead>
          <TableHead>Borrow Cap</TableHead>
          <TableHead>Borrow Limit Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reserveData && reserveData.length > 0 ? (
          reserveData.map((item) => (
            <TableRow key={item.symbol}>
              <TableCell>{item.symbol}</TableCell>
              <TableCell>{item.ltv}</TableCell>
              <TableCell>{item.liquidationThreshold}</TableCell>
              <TableCell className={getPercentageClass(item.utilizationRate)}>
                {item.utilizationRate}
              </TableCell>
              <TableCell>{item.supplyAmount}</TableCell>
              <TableCell>{item.supplyValue}</TableCell>
              <TableCell>{item.supplyCap}</TableCell>
              <TableCell className={getPercentageClass(item.supplyLimitUsed)}>
                {item.supplyLimitUsed}
              </TableCell>
              <TableCell>{item.borrowAmount}</TableCell>
              <TableCell>{item.borrowValue}</TableCell>
              <TableCell>{item.borrowCap}</TableCell>
              <TableCell className={getPercentageClass(item.borrowLimitUsed)}>
                {item.borrowLimitUsed}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={12}>
              Loading data or no data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell>{aggregatedData.totalSupplyValue}</TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
          <TableCell>{aggregatedData.totalBorrowValue}</TableCell>
          <TableCell> </TableCell>
          <TableCell> </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
