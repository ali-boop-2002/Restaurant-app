import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    // In real apps, compute amount on the server from your cart DB
    const {
      amount = req.body.amount,
      currency = "usd",
      metadata = {},
    } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount is in the smallest currency unit (1999 = $19.99)
      currency,
      automatic_payment_methods: { enabled: true }, // Payment Element
      metadata, // optional
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
