"use client";

import { useGetOrdersQuery } from "@/slices/orderApiSlice";
import { useEffect, useState } from "react";

function page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: orders } = useGetOrdersQuery(undefined, {
    pollingInterval: 15000,
  });
  console.log(orders);

  if (!orders) {
    return (
      <h1 className="flex h-screen justify-center text-center items-center text-2xl bg-yellow-50">
        You havent placed any order
      </h1>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col container mx-auto max-w-2xl m-5 rounded">
        {orders?.map((order) => (
          <div
            key={order._id}
            className=" m-2 pb-4  border-b-2 border-gray-200"
          >
            <div className="bg-gray-100 flex flex-row pl-4 justify-between rounded-full text-xl font-sans">
              <h1> {order._id}</h1>
              <h1
                className={`${
                  order.orderStatus === "Confirmed" && "bg-green-500 text-white"
                } ${
                  order.orderStatus === "Served" && "bg-yellow-400 text-white"
                } ${
                  order.orderStatus === "Ready For Pickup" &&
                  "bg-blue-500 text-white"
                } rounded-full px-4`}
              >
                {order.orderStatus}
              </h1>
            </div>
            <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
            <ul className="mt-2 space-y-1">
              {order.orderItems?.map((item, idx) => (
                <li key={item._id} className="flex justify-between">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
