import Custombutton from "@/components/Custombutton";
import FeaturedItems from "@/components/FeaturedItems";
import Link from "next/link";
import { Suspense } from "react";

const { default: FoodCarousel } = require("@/components/FoodCarousel");

export const metadata = {
  title: "Pakistani Indian cuisines",
  description: "All the food here is made fresh by our professional chef",
};
function page() {
  return (
    <>
      <Suspense fallback={<p>Loading product...</p>}>
        <FoodCarousel />
      </Suspense>
      <FeaturedItems />
      <div className=" flex flex-col justify-center items-center m-5">
        <Link href={"/menu"}>
          <Custombutton
            bg={"bg-gray-300"}
            text={"view entire menu"}
            size={"lg"}
          />
        </Link>
      </div>
    </>
  );
}

export default page;
