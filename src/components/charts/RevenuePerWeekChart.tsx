// "use client";

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { week: "Week 1", revenue: 4200 },
//   { week: "Week 2", revenue: 5300 },
//   { week: "Week 3", revenue: 6100 },
//   { week: "Week 4", revenue: 7200 },
// ];

// const RevenuePerWeekChart = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 h-[380px]">
//       <h2 className="text-lg font-semibold mb-4">
//         Revenue Per Week (₵)
//       </h2>

//       <ResponsiveContainer width="100%" height="85%">
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#86efac" stopOpacity={0.8} />
//               <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//           <XAxis dataKey="week" tickLine={false} axisLine={false} />
//           <YAxis tickLine={false} axisLine={false} />
//           <Tooltip />
//           <Area
//             type="monotone"
//             dataKey="revenue"
//             stroke="#22c55e"
//             fill="url(#revenueFill)"
//             strokeWidth={3}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default RevenuePerWeekChart;



"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type RevenuePerWeekItem = {
  week: string;
  revenue: number;
};

type Props = {
  data: RevenuePerWeekItem[];
};

const RevenuePerWeekChart = ({ data }: Props) => {
  return (
    <div className="bg-muted rounded-xl p-4 h-[380px] shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Revenue Per Week (₵)
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            fill="url(#revenueFill)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenuePerWeekChart;
