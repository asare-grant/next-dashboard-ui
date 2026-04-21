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
import { Eye, Pencil, Printer, Trash2 } from "lucide-react";
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
import Image from "next/image";
import { useTheme } from "next-themes";
import Barcode from "react-barcode";

ModuleRegistry.registerModules([AllCommunityModule]);

const DELIVERY_ORDER_STATUSES = [
  "pending",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

const PICKUP_ORDER_STATUSES = [
  "pending",
  "preparing",
  "ready_for_pickup",
  "picked_up",
  "cancelled",
];

const getOrderStatusClass = (status: string) => {
  switch (status) {
    case "preparing":
    case "on_the_way":
    case "ready_for_pickup":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300 ";
    case "delivered":
    case "picked_up":
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

  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const [printOpen, setPrintOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { theme } = useTheme();

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
  const handleSaveOrder = async (data: { orderStatus: string }) => {
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

  //   Kitchen print receipt function
  // const handlePrintNow = () => {
  //   const printContents = document.getElementById("print-area")?.innerHTML;

  //   const originalContents = document.body.innerHTML;

  //   if (!printContents) return;

  //   document.body.innerHTML = printContents;

  //   window.print();

  //   document.body.innerHTML = originalContents;

  //   window.location.reload(); // ensures React restores properly
  // };

  const handlePrintNow = () => {
    window.print();
  };

  /* ---------------- COLUMN DEFINITIONS ---------------- */
  const columnDefs = useMemo<ColDef<Order>[]>(
    () => [
      { headerName: "Order Ref", field: "id", minWidth: 140 },
      // { headerName: "Customer", field: "customerName", minWidth: 180 },
      {
        headerName: "Total (₵)",
        field: "total",
        minWidth: 120,
        valueFormatter: (p) => `₵${p.value.toFixed(2)}`,
      },
      {
        headerName: "Order Timing",
        field: "timingType",
        minWidth: 130,
        cellRenderer: (p: any) => {
          const isScheduled = p.value === "scheduled";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isScheduled
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-slate-100 text-slate-700 border-slate-300"
              }`}
            >
              {isScheduled ? "PREORDER" : "ASAP"}
            </span>
          );
        },
      },
      {
        headerName: "Scheduled For",
        field: "scheduledAt",
        minWidth: 190,
        valueFormatter: (p) => {
          if (!p.value) return "—";
          return new Date(p.value).toLocaleString("en-GB");
        },
      },
      {
        headerName: "Order Type",
        field: "fulfillmentType",
        minWidth: 130,
        cellRenderer: (p: any) => {
          const isPickup = p.value === "pickup";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isPickup
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : "bg-blue-100 text-blue-800 border-blue-300"
              }`}
            >
              {isPickup ? "PICK UP" : "DELIVERY"}
            </span>
          );
        },
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
      // {
      //   headerName: "Order Status",
      //   field: "orderStatus",
      //   minWidth: 170,
      //   cellRenderer: (p: any) => (
      //     <select
      //       className={`rounded-md border px-2 py-1 text-sm transition
      //   ${getOrderStatusClass(p.data.orderStatus)}
      // `}
      //       value={p.data.orderStatus}
      //       onChange={async (e) => {
      //         const nextStatus = e.target.value;

      //         if (
      //           p.data.paymentStatus !== "paid" &&
      //           ["preparing", "on_the_way", "ready_for_pickup", "delivered", "picked_up"].includes(nextStatus)
      //         ) {
      //           toast.error("Cannot process unpaid order");
      //           return;
      //         }

      //         const prev = p.data.orderStatus;
      //         p.data.orderStatus = nextStatus;
      //         p.api.refreshCells({ rowNodes: [p.node] });

      //         try {
      //           await updateOrder(p.data.id, {
      //             orderStatus: nextStatus,
      //           });
      //           toast.success("Order status updated");
      //         } catch {
      //           p.data.orderStatus = prev;
      //           p.api.refreshCells({ rowNodes: [p.node] });
      //           toast.error("Update failed");
      //         }
      //       }}
      //       // onChange={async (e) => {
      //       //   const prev = p.data.orderStatus;
      //       //   p.data.orderStatus = e.target.value;
      //       //   p.api.refreshCells({ rowNodes: [p.node] });

      //       //   try {
      //       //     await updateOrder(p.data.id, {
      //       //       orderStatus: e.target.value,
      //       //       paymentStatus: p.data.paymentStatus,
      //       //     });
      //       //     toast.success("Status updated");
      //       //   } catch {
      //       //     p.data.orderStatus = prev;
      //       //     p.api.refreshCells({ rowNodes: [p.node] });
      //       //     toast.error("Update failed");
      //       //   }
      //       // }}
      //     >
      //       {ORDER_STATUSES.map((s) => (
      //         <option key={s} value={s}>
      //           {s.toUpperCase()}
      //         </option>
      //       ))}
      //     </select>
      //   ),
      // },
      {
        headerName: "Order Status",
        field: "orderStatus",
        minWidth: 170,
        cellRenderer: (p: any) => {
          const fulfillmentType = p.data.fulfillmentType || "delivery";

          const allowedStatuses =
            fulfillmentType === "pickup"
              ? PICKUP_ORDER_STATUSES
              : DELIVERY_ORDER_STATUSES;

          return (
            <select
              className={`rounded-md border px-2 py-1 text-sm transition
          ${getOrderStatusClass(p.data.orderStatus)}
        `}
              value={p.data.orderStatus}
              onChange={async (e) => {
                const nextStatus = e.target.value;

                if (
                  p.data.paymentStatus !== "paid" &&
                  [
                    "preparing",
                    "on_the_way",
                    "ready_for_pickup",
                    "delivered",
                    "picked_up",
                  ].includes(nextStatus)
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
            >
              {allowedStatuses.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          );
        },
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
        headerName: "Items",
        minWidth: 180,
        cellRenderer: (p: any) => {
          const items = p.data.items || [];

          return (
            <button
              className="text-blue-600 underline text-sm"
              onClick={() => {
                setSelectedItems(items);
                setItemsModalOpen(true);
              }}
            >
              View Items ({items.length})
            </button>
          );
        },
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
      // {
      //   headerName: "Payment Ref",
      //   field: "paymentReference",
      //   minWidth: 180,
      //   cellRenderer: (p: any) => (
      //     <span className="font-mono text-xs">{p.value || "—"}</span>
      //   ),
      // },
      {
        headerName: "Customer Phone",
        field: "customerPhone",
        minWidth: 160,
        cellRenderer: (p: any) =>
          p.value ? (
            <a
              href={`tel:${p.value}`}
              className="font-mono text-sm text-blue-700 hover:underline"
            >
              {p.value}
            </a>
          ) : (
            <span>—</span>
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
            <Button
              size="icon"
              variant="outline"
              className="bg-blue-200"
              onClick={() => {
                setSelectedOrder(p.data);
                setPrintOpen(true);
              }}
            >
              <Printer size={16} />
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
  // const gridTheme = themeQuartz.withParams({
  //   spacing: 6,
  //   rowBorder: true,
  //   foregroundColor: "#1f2937",
  //   backgroundColor: "#ffffff",
  //   headerBackgroundColor: "#f1f5f9",
  //   rowHoverColor: "#e0e7ff",
  //   borderRadius: 12,
  //   borderWidth: 2,
  // });
  const gridTheme = useMemo(() => {
    const isDark = theme === "dark";

    return themeQuartz.withParams({
      spacing: 6,
      rowBorder: true,
      foregroundColor: isDark ? "#e5e7eb" : "#1f2937",
      backgroundColor: isDark ? "#020617" : "#ffffff",
      headerBackgroundColor: isDark ? "#020617" : "#f1f5f9",
      rowHoverColor: isDark ? "#1e293b" : "#e0e7ff",
      borderRadius: 12,
      borderWidth: 2,
    });
  }, [theme]);

  /* ---------------- LOADING & EMPTY STATES ---------------- */
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-foreground">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-border border-t-primary mb-4" />
      <p className="text-sm">Loading orders...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        🛒
      </div>
      <h2 className="text-lg font-semibold">No orders yet</h2>
      <p className="text-sm text-foreground">
        Orders will appear here once customers place them.
      </p>
    </div>
  );

  const [printMeta, setPrintMeta] = useState({
    printedAt: "",
    serial: "",
  });

  useEffect(() => {
    if (selectedOrder) {
      const now = new Date();

      const serial = `RC-${Date.now().toString().slice(-6)}`;

      setPrintMeta({
        printedAt: now.toLocaleString("en-GB"),
        serial,
      });
    }
  }, [selectedOrder]);

  return (
    <div className="bg-muted rounded-xl p-4 m-4 mt-0 flex-1">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-blue-300">Orders</h1>
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
      {itemsModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>

            {selectedItems.map((item, index) => {
              const customizations = item.customizations
                ? JSON.parse(item.customizations)
                : [];

              const drinks = (() => {
                try {
                  if (Array.isArray(item.drinks)) return item.drinks;
                  if (typeof item.drinks === "string")
                    return JSON.parse(item.drinks);
                  return [];
                } catch {
                  return [];
                }
              })();

              return (
                <div
                  key={index}
                  className="border rounded-lg p-3 mb-3 bg-muted text-muted-foreground"
                >
                  <p className="font-semibold">{item.name}</p>

                  <p className="text-sm">
                    Quantity: <strong>{item.quantity}</strong>
                  </p>

                  <p className="text-sm">
                    Packaging:{" "}
                    <strong>{formatPackaging(item.packaging)}</strong>
                  </p>

                  <p className="text-sm">Unit Price: ₵{item.unitPrice}</p>

                  {/* CUSTOMIZATIONS */}
                  {customizations.length > 0 && (
                    <div className="text-sm mt-1">
                      <p className="font-medium">Customizations:</p>
                      <ul className="list-disc ml-4">
                        {customizations.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* DRINKS */}
                  {drinks.length > 0 && (
                    <p className="text-xs">Drinks: {drinks.join(", ")}</p>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end mt-4">
              <Button onClick={() => setItemsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      ;
      {printOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPrintOpen(false)}
          />

          {/* PANEL */}
          <div className="relative w-[350px] h-full bg-card text-card-foreground shadow-xl p-4 overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-foreground">
                Receipt Preview
              </h2>
              <Button variant="ghost" onClick={() => setPrintOpen(false)}>
                ✕
              </Button>
            </div>

            {/* RECEIPT CONTENT */}
            <div id="print-area" className="font-mono text-sm">
              <div className="text-center mb-2">
                <div className="flex justify-center gap-4 items-center ">
                  <Image
                    src="/splash-icon.png"
                    alt="logo"
                    width={30}
                    height={30}
                  />
                  <h2 className="text-center font-bold text-lg">RAAJ FOODS</h2>
                </div>
                <p className="text-xs">Fast Food • Delivery • Pickup</p>
              </div>

              <div className="border-t border-dashed my-3" />

              <p>Order Ref: {selectedOrder.id}</p>
              <p>
                Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>Type: {selectedOrder.fulfillmentType}</p>
              <p>Phone: {selectedOrder.customerPhone || "—"}</p>

              {/* {selectedOrder.address && (
                <p className="mt-1">
                  <strong>Address:</strong> {selectedOrder.address.fullAddress}
                </p>
              )} */}

              <div className="border-t border-dashed my-3" />

              {/* ITEMS */}
              {selectedOrder.items.map((item: any, i: number) => {
                const qty = item.quantity || 1;
                const total = qty * item.unitPrice;

                const customizations = item.customizations
                  ? JSON.parse(item.customizations)
                  : [];

                const drinks = (() => {
                  try {
                    if (Array.isArray(item.drinks)) return item.drinks;
                    if (typeof item.drinks === "string")
                      return JSON.parse(item.drinks);
                    return [];
                  } catch {
                    return [];
                  }
                })();

                return (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span>
                        {qty} x {item.name}
                      </span>
                      <span>₵{total.toFixed(2)}</span>
                    </div>

                    <p className="text-xs">
                      ₵{item.unitPrice} each | {item.packaging}
                    </p>

                    {drinks.length > 0 && (
                      <p className="text-xs">Drinks: {drinks.join(", ")}</p>
                    )}

                    {customizations.length > 0 && (
                      <p className="text-xs">
                        Extras: {customizations.join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="border-t border-dashed my-3" />

              {/* SUMMARY */}
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>₵{selectedOrder.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₵{(selectedOrder.deliveryFee || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-base mt-1">
                <span>Grand Total</span>
                <span>
                  ₵
                  {(
                    selectedOrder.total + (selectedOrder.deliveryFee || 0)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-dashed my-3" />

              <p>Payment: {selectedOrder.paymentStatus?.toUpperCase()}</p>
              {/* <p>Status: {selectedOrder.orderStatus?.toUpperCase()}</p> */}

              <p className="text-center mt-3 text-xs">
                Thank you for your order ❤️
              </p>
            </div>

            <div className="border-t border-dashed my-3" />

            {/* BARCODE */}
            <div className="flex flex-col w-full items-center mt-3">
              <Barcode
                value={selectedOrder.id} // you can also use serial
                height={50}
                width={1.5}
                displayValue={false}
              />
            </div>

            <div className="border-t border-dashed my-3" />

            {/* SERIAL + DATE */}
            <div className="flex items-center justify-between text-xs mx-4">
              <p>{printMeta.serial}</p>
              <p>{printMeta.printedAt}</p>
            </div>

            {/* PRINT BUTTON */}
            <div className="mt-6 flex items-center justify-center">
              <Button
                className=" w-content bg-[#17972a80] text-gray-50"
                onClick={() => handlePrintNow()}
              >
                Print Receipt
                <Printer size={16} />
              </Button>
            </div>
          </div>
        </div>
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
