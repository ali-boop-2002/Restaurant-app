"use client";

import MainMenuItemCard from "@/components/MainMenuItemCard";
import { useRef, useEffect, useState, Suspense } from "react";

export default function Page() {
  const [mainMenu, setMainMenu] = useState([]); // ✅ you need useState
  const mainRef = useRef(null);
  const appetizerRef = useRef(null);
  const drinkRef = useRef(null);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setMainMenu);
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="top-15 bg-white/90  backdrop-blur-md z-10 sm:py-4 sm:fixed w-full">
        <button
          onClick={() =>
            mainRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="sm:m-3 px-5 hover:bg-gray-200 hover:cursor-pointer hover:rounded-2xl"
        >
          Main Course
        </button>
        <button
          onClick={() =>
            appetizerRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="sm:m-3 px-5 hover:bg-gray-200 hover:cursor-pointer hover:rounded-2xl"
        >
          Appetizers
        </button>
        <button
          onClick={() =>
            drinkRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="sm:m-3 px-5 hover:bg-gray-200 hover:cursor-pointer hover:rounded-2xl"
        >
          Drinks
        </button>
      </div>
      <div className="sm:pt-40 container mx-auto  ">
        <span ref={mainRef} className="text-2xl m-5 block">
          Main Courses
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2  ">
          {mainMenu
            .filter((item) => item.category === "main")
            .map((item) => (
              <MainMenuItemCard item={item} key={item._id} />
            ))}
        </div>

        <span ref={appetizerRef} className="text-2xl m-5 block">
          Appetizers
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          {mainMenu
            .filter((item) => item.category === "apetizers")
            .map((item) => (
              <MainMenuItemCard item={item} key={item._id} />
            ))}
        </div>

        <span ref={drinkRef} className="text-2xl m-5 block">
          Drinks
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {mainMenu
            .filter((item) => item.category === "drink")
            .map((item) => (
              <MainMenuItemCard item={item} key={item._id} />
            ))}
        </div>
      </div>
    </div>
  );
}
