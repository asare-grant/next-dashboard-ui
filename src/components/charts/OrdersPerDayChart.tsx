// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { day: "Mon", orders: 24 },
//   { day: "Tue", orders: 38 },
//   { day: "Wed", orders: 31 },
//   { day: "Thu", orders: 45 },
//   { day: "Fri", orders: 62 },
//   { day: "Sat", orders: 80 },
//   { day: "Sun", orders: 54 },
// ];

// const OrdersPerDayChart = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 h-[380px]">
//       <h2 className="text-lg font-semibold mb-4">
//         Orders Per Day
//       </h2>

//       <ResponsiveContainer width="100%" height="85%">
//         <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//           <XAxis dataKey="day" tickLine={false} axisLine={false} />
//           <YAxis tickLine={false} axisLine={false} />
//           <Tooltip />
//           <Bar
//             dataKey="orders"
//             radius={[8, 8, 0, 0]}
//             fill="#93c5fd"
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default OrdersPerDayChart;


"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OrdersPerDayChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-muted shadow-sm rounded-xl p-4 h-[380px]">
      <h2 className="text-lg font-semibold mb-4">Orders Per Day</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="orders" fill="#93c5fd" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersPerDayChart;
