// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

// export interface OrderFormValues {
//   orderStatus: OrderStatus;
//   paymentStatus: PaymentStatus;
//   customerName: string;
//   items: Order["items"];
// }

// interface Props {
//   initialData: OrderFormValues;
//   onSubmit: (data: OrderFormValues) => void;
//   onCancel: () => void;
// }

// export default function OrderForm({ initialData, onSubmit, onCancel }: Props) {
//   const [orderStatus, setOrderStatus] = useState(initialData.orderStatus);
//   const [paymentStatus, setPaymentStatus] = useState(initialData.paymentStatus);

//   const [loading, setLoading] = useState(false);

//   const handleSubmit = () => {
//      if (loading) return; // ⛔ Prevent double clicks
//      try {

//       setLoading(true)

//        onSubmit({
//          ...initialData,
//          orderStatus,
//          paymentStatus,
//        });

//      } catch (error) {
//       console.log(error)
//       setLoading(false)
//      }
//   };

//   return (
//     <div className="space-y-4 max-h-[500px] overflow-y-auto">
//       {/* CUSTOMER */}
//       <div>
//         <Label>Customer</Label>
//         <Input value={initialData.customerName} readOnly />
//       </div>

//       {/* ORDER STATUS */}
//       <div>
//         <Label>Order Status</Label>
//         <select
//           className="w-full border rounded-md p-2"
//           value={orderStatus}
//           onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
//         >
//           <option value="pending">Pending</option>
//           <option value="preparing">Preparing</option>
//           <option value="on_the_way">On The Way</option>
//           <option value="delivered">Delivered</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* PAYMENT STATUS */}
//       <div>
//         <Label>Payment Status</Label>
//         <select
//           className="w-full border rounded-md p-2"
//           value={paymentStatus}
//           onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
//         >
//           <option value="pending">Pending</option>
//           <option value="processing">Processing</option>
//           <option value="paid">Paid</option>
//         </select>
//       </div>

//       {/* ITEMS */}
//       <div>
//         <Label>Order Items</Label>
//         <div className="space-y-2 mt-2">
//           {initialData.items.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-2 border-b py-2 last:border-b-0"
//             >
//               <div className="w-12 h-12 relative flex-shrink-0">
//                 {item.image ? (
//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     width={48}
//                     height={48}
//                     className="object-cover rounded"
//                   />
//                 ) : (
//                   <div className="w-12 h-12 bg-gray-200 rounded" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-xs text-gray-500">
//                   Pack: {item.pack || "None"} | Drinks:{" "}
//                   {Array.isArray(item.drinks)
//                     ? item.drinks.join(", ")
//                     : item.drinks || "None"}{" "}
//                   | Customizations:{" "}
//                   {Array.isArray(item.customizations)
//                     ? item.customizations.join(", ")
//                     : item.customizations || "None"}
//                 </p>
//               </div>
//               <div className="text-sm font-medium">
//                 {item.quantity} × ₵{item.unitPrice.toFixed(2)}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex justify-end gap-2 mt-4">
//         <Button
//           disabled={loading}
//           variant="outline"
//           onClick={onCancel}
//           className="bg-red-300"
//         >
//           Cancel
//         </Button>
//         <Button
//           disabled={loading}
//           onClick={handleSubmit}
//           className="w-[150] rounded-lg py-2 flex items-center justify-center gap-2 bg-blue-300 disabled:opacity-70 disabled:cursor-not-allowed">
//             {loading ? (
//             <>
//               {/* Spinner */}
//               <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               <span>Saving</span>
//             </>
//           ) : (
//             "Save"
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Order, OrderStatus } from "@/types/order";

export interface OrderFormValues {
  orderStatus: OrderStatus;
  customerName: string;
  items: Order["items"];
  paymentStatus: Order["paymentStatus"];
}

interface Props {
  initialData: OrderFormValues;
  onSubmit: (data: { orderStatus: OrderStatus }) => void;
  onCancel: () => void;
}

export default function OrderForm({ initialData, onSubmit, onCancel }: Props) {
  const [orderStatus, setOrderStatus] = useState(initialData.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);
      onSubmit({ orderStatus });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {/* CUSTOMER */}
      <div>
        <Label>Customer</Label>
        <Input value={initialData.customerName} readOnly />
      </div>

      {/* PAYMENT STATUS (READ ONLY) */}
      <div>
        <Label>Payment Status</Label>
        <div className="mt-1">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border
              ${
                initialData.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : initialData.paymentStatus === "processing"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
          >
            {initialData.paymentStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ORDER STATUS */}
      <div>
        <Label>Order Status</Label>
        <select
          className="w-full border rounded-md p-2"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="on_the_way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ITEMS */}
       <div>
         <Label>Order Items</Label>
         <div className="space-y-2 mt-2">
           {initialData.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border-b py-2 last:border-b-0"
            >
              <div className="w-12 h-12 relative flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Pack: {item.pack || "None"} | Drinks:{" "}
                  {Array.isArray(item.drinks)
                    ? item.drinks.join(", ")
                    : item.drinks || "None"}{" "}
                  | Customizations:{" "}
                  {Array.isArray(item.customizations)
                    ? item.customizations.join(", ")
                    : item.customizations || "None"}
                </p>
              </div>
              <div className="text-sm font-medium">
                {item.quantity} × ₵{item.unitPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} className="bg-red-300">
          Cancel
        </Button>

        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-[150] rounded-lg py-2 flex items-center justify-center gap-2 bg-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving</span>
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
