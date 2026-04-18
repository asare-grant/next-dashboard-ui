"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type FinanceItem = {
  name: string;
  income: number;
  expense: number;
};

type Props = {
  data: FinanceItem[];
};

const FinanceChart = ({ data }: Props) => {
  return (
    <div className="bg-muted rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af" }}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 20 }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
