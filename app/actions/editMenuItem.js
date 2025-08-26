"use server";

import connectDB from "@/config/database";
import Items from "@/models/Item";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function editMenuItem(formData) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session.user || !session.user.isAdmin) {
    throw new Error("invalid credentials");
  }
  const id = formData.get("id");

  const updateMenuItem = {
    name: formData.get("name"),
    hasSides: formData.get("hasSides") === "on",
    description: formData.get("description"),
    // image: imageUrl,
    sides: formData.getAll("sides"),
    hasSize: formData.get("hasSize") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    veg: formData.get("veg") === "on",
    category: formData.get("category"),
  };

  await Items.findByIdAndUpdate(id, updateMenuItem);
  revalidatePath(
    "/",
    "/menu",
    // "/admin/edit-menu-item",
    "/admin/edit-menu-item/[id]"
  );
  redirect("/admin/edit-menu-item");
}

export default editMenuItem;
