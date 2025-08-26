import connectDB from "@/config/database";
import Order from "@/models/Order";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorizede" }, { status: 401 });
    }
    const userId = session.user.id;

    const foundOrder = await Order.find()
      .sort({
        createdAt: -1,
      })
      .populate("user", "email");

    // ✅ Always return 200 with an array
    return NextResponse.json(foundOrder, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
