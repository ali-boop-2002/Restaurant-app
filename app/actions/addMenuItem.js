"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Items from "@/models/Item";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function streamUpload(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "restaurant-app" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

export async function addMenuItem(formData) {
  try {
    console.log(formData);
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session.user || !session.user.isAdmin) {
      throw new Error("invalid credentials");
    }
    const rawPrice = formData.get("price");
    const price = Number(rawPrice);
    if (isNaN(price)) throw new Error("Invalid price value.");
    const file = formData.get("image");
    let imageUrl = "";

    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await streamUpload(buffer);
      imageUrl = uploadResult.secure_url;
    }
    const menuItem = {
      name: formData.get("name"),
      hasSides: formData.get("hasSides") === "on",
      description: formData.get("description"),
      image: imageUrl,
      sides: formData.getAll("sides"),
      size: formData.get("hasSize") === "on",
      price,
      isFeatured: formData.get("isFeatured") === "on",
      veg: formData.get("veg") === "on",
      category: formData.get("category"),
    };

    const newMenuItem = new Items(menuItem);
    await newMenuItem.save();
    redirect(`/menu`);
  } catch (error) {
    console.log(error);
  }
}
