"use client";

import { addMenuItem } from "@/app/actions/addMenuItem";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
  const [sides, setSides] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status !== "loading" && (!session || !session.user?.isAdmin)) {
      router.push("/"); // ✅ Safe client-side redirect
    }
  }, [session, status, router]);
  console.log(session);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        className="bg-gray-200 p-6 rounded-md w-full max-w-md"
        action={addMenuItem}
      >
        <h2 className="text-2xl font-semibold mb-4">Add Menu Item</h2>

        {/* Item Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1">Item Name</label>
          <input
            name="name"
            type="text"
            placeholder="e.g. Chicken Biryani"
            className="p-2 rounded border border-gray-300"
          />
        </div>

        {/* Has Sides */}
        <div className="flex items-center mb-4">
          <label className="mr-2">Does it have sides?</label>
          <input
            name="hasSides"
            type="checkbox"
            onChange={(e) => setSides(e.target.checked)}
          />
        </div>

        {/* Sides Selection */}
        {sides && (
          <div className="mb-4">
            <label className="block mb-2">If it has sides, choose them:</label>
            <div className="flex flex-col gap-2">
              {["raita", "salad", "naan", "white sauce"].map((side) => (
                <label key={side} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sides"
                    value={side}
                    className="accent-yellow-500"
                  />
                  {side}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col mb-4">
          <label className="mr-2">Description of the item</label>
          <input
            name="description"
            type="text"
            placeholder="please write description"
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="mr-2">Please select image of the item</label>
          <input
            name="image"
            type="file"
            className="bg-blue-300 p-2 rounded-2xl hover:cursor-pointer hover:bg-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2">Does it have many sizes?</label>
          <input
            name="hasSize"
            type="checkbox"
            // onChange={(e) => setSize(e.target.checked)}
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2">Is it a featured item?</label>
          <input name="isFeatured" type="checkbox" />
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2">Is it a veg item?</label>
          <input name="veg" type="checkbox" />
        </div>
        <div className="flex flex-col mb-4">
          <label className="mr-2">Please select the item category</label>
          <div className="flex flex-row">
            <div>
              <input
                name="category"
                value="main"
                type="radio"
                className="m-2 hover:cursor-pointer"
              />
              <label htmlFor="main">Main course</label>
            </div>
            <div>
              <input
                name="category"
                type="radio"
                value="apetizers"
                className="m-2 hover:cursor-pointer"
              />
              <label htmlFor="apetizers">Apetizers</label>
            </div>
            <div>
              <input
                name="category"
                type="radio"
                value="drink"
                className="m-2 hover:cursor-pointer"
              />
              <label htmlFor="drink">Drink</label>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mr-2">Price of the item</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="please write the price"
              className="border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Page;
