// app/api/create-order/route.js
import { NextResponse } from "next/server";

import Order from "@/models/Order";
import connectDB from "@/config/database";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // if using NextAuth

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const {
      orderItems,
      orderForDeliver,
      orderForReservation,
      orderForPickup,
      deliveryAddress,
      isPaid,
      totalPrice,
      taxPrice,
      reservationDate,
    } = body;

    // Example: get the user (if you use NextAuth)

    // const { searchParams } = new URL(req.url);
    // const userId = searchParams.get("userId");
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // For quick testing without auth:
    // const userId = body.userId || null;

    // Basic validation
    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    // Create and save
    const order = await Order.create({
      user: userId, // replace with session user id when you add auth
      orderItems,
      orderForDeliver,
      orderForReservation,
      orderForPickup,
      deliveryAddress,
      isPaid,
      totalPrice,
      taxPrice,
      reservationDate,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "bad request", message: err.message },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorizede" }, { status: 401 });
    }
    const userId = session.user.id;

    const foundOrder = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    // ✅ Always return 200 with an array
    return NextResponse.json(foundOrder, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
