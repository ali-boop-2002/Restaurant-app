"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { redirect } from "next/navigation";

export async function registerUser(formData) {
  await connectDB();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(name, email, password);
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  await User.create({
    username: name,
    email,
    password,
  });
  redirect("/signin");
}
