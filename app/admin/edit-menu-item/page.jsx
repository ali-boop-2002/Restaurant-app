import ItemCard from "@/components/ItemCard";
import { ArrowBigLeft } from "lucide-react";

import connectDB from "@/config/database";
import Items from "@/models/Item";
import Link from "next/link";

async function page() {
  await connectDB();
  const menuItem = await Items.find({});

  return (
    <div className="min-h-screen">
      <button className="bg-yellow-400 rounded-full m-10 hover:cursor-pointer">
        <Link href={"/admin"}>
          <ArrowBigLeft size={40} />
        </Link>
      </button>
      <div className="grid gird-cols-1 container mx-auto py-10 px-25  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {menuItem.map((item, index) => (
          <div
            key={index}
            className="max-w-2xs m-4 flex justify-center items-center relative"
          >
            {/* Top Buttons Row */}

            {/* Item Card */}
            <ItemCard
              admin={true}
              id={item.id}
              name={item.name}
              isFeatured={item.isFeatured}
              image={item.image}
              description={item.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default page;
