// "use client";

// const orders = [
//   {
//     id: "FD-90231",
//     customer: "Kwame Mensah",
//     total: 85,
//     status: "Delivered",
//     time: "5 mins ago",
//   },
//   {
//     id: "FD-90230",
//     customer: "Ama Boateng",
//     total: 120,
//     status: "Preparing",
//     time: "12 mins ago",
//   },
//   {
//     id: "FD-90229",
//     customer: "Yaw Asante",
//     total: 60,
//     status: "Pending",
//     time: "25 mins ago",
//   },
//   {
//     id: "FD-90228",
//     customer: "Esi Nyarko",
//     total: 150,
//     status: "On the way",
//     time: "40 mins ago",
//   },
// ];

// const statusColor = (status: string) => {
//   switch (status) {
//     case "Delivered":
//       return "bg-green-100 text-green-700";
//     case "Preparing":
//       return "bg-blue-100 text-blue-700";
//     case "On the way":
//       return "bg-purple-100 text-purple-700";
//     default:
//       return "bg-yellow-100 text-yellow-700";
//   }
// };

// const RecentOrdersWidget = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 h-full">
//       <h2 className="text-lg font-semibold mb-4">
//         Recent Orders
//       </h2>

//       <div className="space-y-3">
//         {orders.map((order) => (
//           <div
//             key={order.id}
//             className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
//           >
//             <div>
//               <p className="font-medium">{order.customer}</p>
//               <p className="text-xs text-gray-500">
//                 {order.id} • {order.time}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="font-semibold">₵{order.total}</p>
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${statusColor(
//                   order.status
//                 )}`}
//               >
//                 {order.status}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecentOrdersWidget;



"use client";

export type RecentOrder = {
  id: string;
  customer: string;
  total: number;
  status: string;
  time: string;
};

type Props = {
  data: RecentOrder[];
};

const statusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Preparing":
      return "bg-blue-100 text-blue-700";
    case "On the way":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const RecentOrdersWidget = ({ data }: Props) => {
  return (
    <div className="bg-muted rounded-xl p-4 h-full shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Recent Orders
      </h2>

      <div className="space-y-3">
        {data.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-medium">{order.customer}</p>
              <p className="text-xs text-foreground">
                {order.id} • {order.time}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₵{order.total}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrdersWidget;
