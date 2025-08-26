// components/ImageCarousel.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const images = [
  "/Images/Screenshot 2025-07-23 at 10.26.34 PM.png",
  "/Images/Screenshot 2025-07-23 at 10.28.42 PM.png",
  "/Images/Screenshot 2025-07-23 at 10.25.01 PM.png",
];

export default function FoodCarousel() {
  return (
    <div className=" flex flex-col justify-center items-center ">
      <div className=" max-w-screen p-2 ">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={false}
          loop={true}
          className="rounded-4xl"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={`Slide ${index}`}
                width="0"
                height="0"
                sizes="50vw"
                className="w-full h-100 object-cover "
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
