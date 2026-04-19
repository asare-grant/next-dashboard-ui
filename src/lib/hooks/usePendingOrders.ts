"use client";

import { useEffect, useRef, useState } from "react";
import client from "@/lib/appwrite-client";
import { mapOrderFromBackend } from "@/lib/mappers/order.mapper";
import { toast } from "react-toastify";

export function usePendingOrders() {
  const [count, setCount] = useState(0);

  // 🔊 Prevent duplicate sounds on fast events
  const lastSoundTimeRef = useRef(0);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();

        const pending = data.orders.filter(
          (o: any) => o.orderStatus === "pending"
        );

        setCount(pending.length);
      } catch (err) {
        console.error("Failed to fetch pending orders", err);
      }
    };

    fetchPending();
  }, []);

  /* ================= SOUND ================= */
  const playSound = () => {
    const now = Date.now();

    // ⛔ prevent spam (1.5s cooldown)
    if (now - lastSoundTimeRef.current < 1500) return;

    lastSoundTimeRef.current = now;

    const audio = new Audio("/sound/new-order.mp3");
    audio.volume = 1;
    audio.play().catch(() => {
      // browser may block autoplay until user interacts
      console.warn("Sound blocked until user interaction");
    });
  };

  /* ================= REALTIME ================= */
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID}.documents`,
      (event) => {
        if (!event?.payload) return;

        const order = mapOrderFromBackend(event.payload);

        const isCreate = event.events.some((e: string) =>
          e.endsWith(".create")
        );
        const isUpdate = event.events.some((e: string) =>
          e.endsWith(".update")
        );

        /* 🟢 NEW ORDER CREATED */
        if (isCreate && order.orderStatus === "pending") {
          setCount((prev) => prev + 1);

          // 🔔 SOUND
          playSound();

          // 💬 POPUP
          toast.success(`New order received (#${order.id})`, {
            position: "top-right",
            autoClose: 5000,
          });
        }

        /* 🟡 ORDER UPDATED */
        if (isUpdate) {
          setCount((prev) => {
            // If order moved OUT of pending → decrease
            if (order.orderStatus !== "pending") {
              return Math.max(prev - 1, 0);
            }

            // If order moved INTO pending (rare but safe)
            if (order.orderStatus === "pending") {
              return prev + 1;
            }

            return prev;
          });
        }

      }
    );

    return () => unsubscribe();
  }, []);

  return count;
}