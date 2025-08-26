// Payment.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// -- Child that actually confirms the payment --
function CheckoutForm({ payNow, onDone }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const firedRef = useRef(false); // avoid double-fire on same render

  // Programmatic submit
  useEffect(() => {
    if (!payNow) return; // only when parent tells us to pay
    if (!stripe || !elements) return; // wait until Stripe is ready

    if (firedRef.current) return; // guard against double calls
    firedRef.current = true;
    (async () => {
      setSubmitting(true);
      setMessage("");

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/complete`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message || "Payment failed.");
        setSubmitting(false);
        onDone?.({ ok: false, error: error.message });
        firedRef.current = false; // allow retry if parent toggles payNow again
        return;
      }

      // success or handled 3DS
      setMessage("Payment processing…");
      setSubmitting(false);
      onDone?.({ ok: true });
      firedRef.current = false;
      // setPaymentStarted(false);
    })();
  }, [payNow, stripe, elements, onDone]);

  // // Optional manual button for testing (can hide it)
  // const handleManualSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!stripe || !elements || submitting) return;
  //   // same confirmPayment as above if you want manual submit too
  // };

  return (
    <form className="space-y-4">
      <PaymentElement />

      {submitting && "Processing…"}

      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}

// -- Wrapper that creates the PaymentIntent (amount lives here) --
export default function Payment({ amountCents, payNow, onDone }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeError, setStripeError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountCents, currency: "usd" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create PI");
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (err) {
        if (!cancelled) setStripeError(err.message);
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [amountCents]);

  if (stripeError) return <p className="text-red-600">{stripeError}</p>;
  if (!clientSecret) return <p>Loading payment…</p>;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <CheckoutForm payNow={payNow} onDone={onDone} />
    </Elements>
  );
}
