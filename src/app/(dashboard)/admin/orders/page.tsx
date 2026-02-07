"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  themeQuartz,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Order } from "@/types/order";
import { getOrders, updateOrder, deleteOrder } from "@/lib/api/orders";
import { mapOrderFromBackend } from "@/lib/mappers/order.mapper";

import OrderFormModal from "@/components/orders/OrderFormModal";
import { OrderFormValues } from "@/components/orders/OrderForm";
import DeleteOrderDialog from "@/components/orders/DeleteOrderDialog";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/constants/order-status";

import client from "@/lib/appwrite-client";
import { account } from "@/lib/appwrite-client";

ModuleRegistry.registerModules([AllCommunityModule]);

const getOrderStatusClass = (status: string) => {
  switch (status) {
    case "preparing":
    case "on_the_way":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-transparent text-gray-700 border-gray-300";
  }
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-300";
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-transparent text-gray-700 border-gray-300";
  }
};

const formatPackaging = (p: string) => {
  switch (p) {
    case "leaf":
      return "Leaf";
    case "pack":
      return "Pack";
    case "pack_and_leaf":
      return "Pack & Leaf";
    default:
      return "Pack";
  }
};

export default function OrdersPage() {
  const gridRef = useRef<AgGridReact<Order>>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<"admin" | "manager" | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const canEdit = role === "admin" || role === "manager";
  const canDelete = role === "admin";

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      const mappedOrders: Order[] = res.orders.map(mapOrderFromBackend);

      mappedOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setOrders(mappedOrders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (user) {
      const parsed = JSON.parse(user);
      setRole(parsed.role); // "admin" | "manager" | "staff"
    }
  }, []);

  /* ================= SAVE ================= */
  const handleSaveOrder = async (data: {
    orderStatus: string;
  }) => {
    if (!editingOrder) return;

    try {
      const res = await updateOrder(editingOrder.id, data);

      if (res?.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === editingOrder.id ? mapOrderFromBackend(res.order) : o,
          ),
        );
      } else {
        await fetchOrders(); // safety fallback
      }

      toast.success("Order updated");
      setModalOpen(false);
      setEditingOrder(null);
    } catch {
      toast.error("Update failed");
    }
  };

  const requestDelete = (order: Order) => {
    setOrderToDelete(order);
    setDeleteOpen(true);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete.id);
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      toast.success("Order deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteOpen(false);
      setOrderToDelete(null);
    }
  };

  /* ---------------- COLUMN DEFINITIONS ---------------- */
  const columnDefs = useMemo<ColDef<Order>[]>(
    () => [
      { headerName: "Order Ref", field: "id", minWidth: 140 },
      { headerName: "Customer", field: "customerName", minWidth: 180 },
      {
        headerName: "Total (₵)",
        field: "total",
        minWidth: 120,
        valueFormatter: (p) => `₵${p.value.toFixed(2)}`,
      },
      {
        headerName: "Payment Method",
        field: "paymentMethod",
        minWidth: 130,
        cellRenderer: (p: any) => (
          <span className="px-2 py-1 rounded-full text-xs bg-slate-100">
            {p.value?.toUpperCase()}
          </span>
        ),
      },
      {
        headerName: "Order Status",
        field: "orderStatus",
        minWidth: 170,
        cellRenderer: (p: any) => (
          <select
            className={`rounded-md border px-2 py-1 text-sm transition
        ${getOrderStatusClass(p.data.orderStatus)}
      `}
            value={p.data.orderStatus}
            onChange={async (e) => {
              const nextStatus = e.target.value;

              if (
                p.data.paymentStatus !== "paid" &&
                ["preparing", "on_the_way", "delivered"].includes(nextStatus)
              ) {
                toast.error("Cannot process unpaid order");
                return;
              }

              const prev = p.data.orderStatus;
              p.data.orderStatus = nextStatus;
              p.api.refreshCells({ rowNodes: [p.node] });

              try {
                await updateOrder(p.data.id, {
                  orderStatus: nextStatus,
                });
                toast.success("Order status updated");
              } catch {
                p.data.orderStatus = prev;
                p.api.refreshCells({ rowNodes: [p.node] });
                toast.error("Update failed");
              }
            }}
            // onChange={async (e) => {
            //   const prev = p.data.orderStatus;
            //   p.data.orderStatus = e.target.value;
            //   p.api.refreshCells({ rowNodes: [p.node] });

            //   try {
            //     await updateOrder(p.data.id, {
            //       orderStatus: e.target.value,
            //       paymentStatus: p.data.paymentStatus,
            //     });
            //     toast.success("Status updated");
            //   } catch {
            //     p.data.orderStatus = prev;
            //     p.api.refreshCells({ rowNodes: [p.node] });
            //     toast.error("Update failed");
            //   }
            // }}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        ),
      },
      // {
      //   headerName: "Payment Status",
      //   field: "paymentStatus",
      //   minWidth: 170,
      //   cellRenderer: (p: any) => (
      //     <select
      //       className={`rounded-md border px-2 py-1 text-sm transition
      //   ${getPaymentStatusClass(p.data.paymentStatus)}
      // `}
      //       value={p.data.paymentStatus}
      //       onChange={async (e) => {
      //         const prev = p.data.paymentStatus;
      //         p.data.paymentStatus = e.target.value;
      //         p.api.refreshCells({ rowNodes: [p.node] });

      //         try {
      //           await updateOrder(p.data.id, {
      //             paymentStatus: e.target.value,
      //           });
      //           toast.success("Payment updated");
      //         } catch {
      //           p.data.paymentStatus = prev;
      //           p.api.refreshCells({ rowNodes: [p.node] });
      //           toast.error("Update failed");
      //         }
      //       }}
      //     >
      //       {PAYMENT_STATUSES.map((s) => (
      //         <option key={s} value={s}>
      //           {s.toUpperCase()}
      //         </option>
      //       ))}
      //     </select>
      //   ),
      // },
      {
        headerName: "Payment Status",
        field: "paymentStatus",
        minWidth: 160,
        cellRenderer: (p: any) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border
        ${getPaymentStatusClass(p.value)}
      `}
          >
            {p.value?.toUpperCase()}
          </span>
        ),
      },
      {
        headerName: "Packaging",
        minWidth: 180,
        valueGetter: (p) => {
          if (!p.data || !Array.isArray(p.data.items)) return "—";

          const uniquePackaging = Array.from(
            new Set(p.data.items.map((item) => item.packaging)),
          );

          return uniquePackaging.map(formatPackaging).join(", ");
        },
      },
      {
        headerName: "Payment Ref",
        field: "paymentReference",
        minWidth: 180,
        cellRenderer: (p: any) => (
          <span className="font-mono text-xs">{p.value || "—"}</span>
        ),
      },
      {
        headerName: "Hubtel Tx ID",
        field: "hubtelTransactionId",
        minWidth: 200,
        cellRenderer: (p: any) => (
          <span className="font-mono text-xs text-gray-600">
            {p.value || "—"}
          </span>
        ),
      },
      {
        headerName: "Date",
        field: "createdAt",
        minWidth: 180,
        valueFormatter: (p) => new Date(p.value).toLocaleString("en-GB"),
      },
      {
        headerName: "Actions",
        minWidth: 120,
        cellRenderer: (p: any) => (
          <div className="row-actions flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Button size="icon" variant="outline" className="bg-blue-200">
              <Eye size={16} />
            </Button>
            {/* UPDATE – admin & manager */}
            {canEdit && (
              <Button
                size="icon"
                variant="outline"
                className="bg-green-200"
                onClick={() => {
                  setEditingOrder(p.data);
                  setModalOpen(true);
                }}
              >
                <Pencil size={16} />
              </Button>
            )}

            {canDelete && (
              <Button
                size="icon"
                variant="destructive"
                className="bg-red-300"
                onClick={() => {
                  setOrderToDelete(p.data);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [canEdit, canDelete],
  );


  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = client.subscribe(
        `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID}.documents`,
        (event) => {
          if (!event?.payload) return;

          // Only react to create & update events
          if (
            !event.events.some(
              (e: string) => e.endsWith(".create") || e.endsWith(".update"),
            )
          ) {
            return;
          }

          const incoming = mapOrderFromBackend(event.payload);

          setOrders((prev) => {
            const existing = prev.find((o) => o.id === incoming.id);

            // Preserve createdAt if missing
            const safeOrder = {
              ...incoming,
              createdAt:
                incoming.createdAt ||
                existing?.createdAt ||
                new Date().toISOString(),
            };

            const next = [
              safeOrder,
              ...prev.filter((o) => o.id !== incoming.id),
            ];

            return next.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          });
        },
      );
    } catch (err) {
      console.warn("Realtime subscription failed", err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /* ---------------- AG GRID THEME ---------------- */
  const gridTheme = themeQuartz.withParams({
    spacing: 6,
    rowBorder: true,
    foregroundColor: "#1f2937",
    backgroundColor: "#ffffff",
    headerBackgroundColor: "#f1f5f9",
    rowHoverColor: "#e0e7ff",
    borderRadius: 12,
    borderWidth: 2,
  });

  /* ---------------- LOADING & EMPTY STATES ---------------- */
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-gray-500">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary mb-4" />
      <p className="text-sm">Loading orders...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        🛒
      </div>
      <h2 className="text-lg font-semibold">No orders yet</h2>
      <p className="text-sm text-gray-500">
        Orders will appear here once customers place them.
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-4 m-4 mt-0 flex-1">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Orders</h1>
      </div>

      {/* GRID */}
      {loading ? (
        <LoadingState />
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="ag-custom-grid w-full h-[520px] rounded-xl overflow-hidden border">
          <AgGridReact<Order>
            ref={gridRef}
            theme={gridTheme}
            rowData={orders}
            columnDefs={columnDefs}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            suppressCellFocus
            animateRows
            rowSelection={{
              mode: "singleRow",
            }}
            headerHeight={55}
            rowHeight={64}
            getRowClass={() => "ag-row-hover-actions"}
          />
        </div>
      )}

      {/* MODALS */}
      {editingOrder && (
        <OrderFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Order Details - ${editingOrder.id}`}
          initialData={{
            orderStatus: editingOrder.orderStatus,
            paymentStatus: editingOrder.paymentStatus,
            customerName: editingOrder.customerName,
            items: editingOrder.items,
          }}
          onSubmit={handleSaveOrder}
        />
      )}

      <DeleteOrderDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        orderRef={orderToDelete?.id}
      />
    </div>
  );
}

