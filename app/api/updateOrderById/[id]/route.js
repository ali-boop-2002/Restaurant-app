import connectDB from "@/config/database";
import Order from "@/models/Order";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    console.log("Updating order with id:", id);

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const { orderStatus } = body;
    console.log("Order status to update:", orderStatus);

    if (!orderStatus) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
      },
      { new: true, runValidators: true }
    );
    console.log("Order updated in database:", updateOrder);
    return NextResponse.json(updateOrder, { status: 200 });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json(
      { error: "bad request", message: err.message },
      { status: 500 }
    );
  }
}
