"use client";
import OrderScreen from "@/components/OrderScreen";
import SideBar from "@/components/SideBar";
import { useParams } from "next/navigation";

function page() {
  const { id } = useParams();

  return <OrderScreen orderId={id} />;
}

export default page;
