import connectDB from "@/config/database";
import ItemCard from "./ItemCard";
import Items from "@/models/Item";
import Link from "next/link";

async function FeaturedItems() {
  await connectDB();
  const items = await Items.find({});

  return (
    <div className=" flex flex-col justify-center items-center">
      <h2 className="bg-amber-400 text-3xl p-3 rounded-md text-center w-full">
        Featured Items
      </h2>
      <Link href={"/menu"}>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
          {items
            .filter((item) => item.isFeatured === true)
            .map((item, index) => (
              <ItemCard
                key={index}
                name={item.name}
                description={item.description}
                isFeatured={item.isFeatured}
                image={item.image}
              />
            ))}
        </div>
      </Link>
    </div>
  );
}

export default FeaturedItems;
