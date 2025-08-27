"use client";

import editMenuItem from "@/app/actions/editMenuItem";
import connectDB from "@/config/database";
import Items from "@/models/Item";
import { authOptions } from "@/utils/authOptions";
import { ArrowBigLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page({ params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session.user.isAdmin || !session) {
    redirect("/");
  }
  await connectDB();
  const item = await Items.findById(id);
  console.log(item);
  return (
    <div className="min-h-screen ">
      <button className="bg-yellow-400 rounded-full m-10 hover:cursor-pointer">
        <Link href={"/admin/edit-menu-item"}>
          <ArrowBigLeft size={40} />
        </Link>
      </button>

      <div className="flex flex-col justify-center items-center mx-20">
        <form
          className="bg-gray-200 p-6 rounded-md w-full max-w-md"
          action={editMenuItem}
        >
          <input type="hidden" name="id" value={id} />
          <h2 className="text-2xl font-semibold mb-4">Edit Menu Item</h2>
          {/* Item Name */}
          <div className="flex flex-col mb-4">
            <label className="mb-1">Item Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Chicken Biryani"
              defaultValue={item.name}
              className="p-2 rounded border border-gray-300"
            />
          </div>
          {/* Has Sides */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Does it have sides?</label>
            <input
              name="hasSides"
              type="checkbox"
              defaultChecked={item.hasSides}
              // onChange={(e) => setSides(e.target.checked)}
            />
          </div>
          {/* Sides Selection */}
          <div className="mb-4">
            <label className="block mb-2">If it has sides, choose them:</label>
            <div className="flex flex-col gap-2">
              {["raita", "salad", "naan", "white sauce"].map((side, index) => (
                <label key={side} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sides"
                    className="accent-yellow-500"
                    value={side}
                    defaultChecked={item.sides.includes(side)}
                  />
                  {side}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label className="mr-2">Description of the item</label>
            <input
              name="description"
              type="text"
              placeholder="please write description"
              className="border border-gray-300 rounded p-2"
              defaultValue={item.description}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2">Does it have many sizes?</label>
            <input
              name="hasSize"
              type="checkbox"
              defaultChecked={item.hasSize}
              // onChange={(e) => setSize(e.target.checked)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2">Is it a featured item?</label>
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={item.isFeatured}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2">Is it a veg item?</label>
            <input name="veg" type="checkbox" defaultChecked={item.veg} />
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
                  defaultChecked={item.category === "main"}
                />
                <label htmlFor="main">Main course</label>
              </div>
              <div>
                <input
                  name="category"
                  type="radio"
                  value="apetizers"
                  className="m-2 hover:cursor-pointer"
                  defaultChecked={item.category === "apetizers"}
                />
                <label htmlFor="apetizers">Apetizers</label>
              </div>
              <div>
                <input
                  name="category"
                  type="radio"
                  value="drink"
                  className="m-2 hover:cursor-pointer"
                  defaultChecked={item.category === "drink"}
                />
                <label htmlFor="drink">Drink</label>
              </div>
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
    </div>
  );
}

export default Page;
