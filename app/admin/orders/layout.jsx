// app/admin/orders/layout.jsx
"use client";
import SideBar from "@/components/SideBar";

export default function OrdersLayout({ children }) {
  return (
    <div className="grid grid-cols-16 font-sans min-h-screen border-2 border-gray-200 ">
      <SideBar />
      {children}
    </div>
  );
}
