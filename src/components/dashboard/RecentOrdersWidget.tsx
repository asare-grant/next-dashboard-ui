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
    <div className="bg-muted rounded-xl p-4 h-full shadow-sm dark:shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Recent Orders
      </h2>

      <div className="space-y-3">
        {data.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border rounded-lg p-3 hover:bg-muted transition"
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
