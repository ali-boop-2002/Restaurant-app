"use server";

import connectDB from "@/config/database";
import Items from "@/models/Item";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function deleteMenuItem(id) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session.user || !session.user.isAdmin) {
      throw new Error("invalid credentials");
    }

    await Items.findByIdAndDelete(id);
    revalidatePath(
      "/",
      "/menu",
      // "/admin/edit-menu-item",
      "/admin/edit-menu-item/[id]"
    );
    redirect("/admin/edit-menu-item");
  } catch (error) {
    console.error(error);
  }
}

export default deleteMenuItem;
