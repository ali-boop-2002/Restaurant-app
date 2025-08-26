import { useGetAllOrdersQuery } from "@/slices/orderApiSlice";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function SideBar() {
  const {
    data: orders,
    isLoading,
    error,
  } = useGetAllOrdersQuery(undefined, { pollingInterval: 5000 });

  // State to hold the current timestamp (in ms)
  const [nowMs, setNowMs] = useState(Date.now());

  // Update `nowMs` every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 60 * 1000); // 60 seconds

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);
  return (
    <div className="flex flex-col col-span-4 max-h-screen overflow-scroll border-r-2 bg-white border-gray-300">
      <div className="flex items-center bg-gray-200 border-b-2 border-gray-300 justify-center text-center">
        <h1 className="text-3xl">Orders</h1>
      </div>
      <div>
        {orders
          ?.filter((order) => order.orderStatus !== "Served")
          .map((order) => {
            const createdAt = new Date(order.createdAt).getTime();
            const minutesAgo = Math.floor((nowMs - createdAt) / (1000 * 60));

            return (
              <Link key={order._id} href={`/admin/orders/${order._id}`}>
                <div
                  className={`flex flex-col justify-center items-center mt-2 rounded ${
                    order.orderStatus === "Not Confirmed"
                      ? "bg-red-500"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`p-2 hover:cursor-pointer flex flex-col justify-between overflow-hidden ${
                      order.orderStatus === "Not Confirmed"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    <h1 className="text-2xl truncate max-w-[200px] ">
                      {order.user?.email}
                    </h1>
                    <h2>{minutesAgo} mins ago</h2>
                  </div>
                  {order.orderStatus === "Confirmed" && (
                    <div className="bg-green-400 w-full py-0.5"></div>
                  )}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default SideBar;
