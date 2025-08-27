import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import Custombutton from "@/components/Custombutton";
import Link from "next/link";
import connectDB from "@/config/database";
import Items from "@/models/Item";
import { ArrowBigLeft } from "lucide-react";

export default async function AdminPage() {
  try {
    // Ensure database connection
    await connectDB();

    const session = await getServerSession(authOptions);

    // Check if session exists
    if (!session) {
      console.log("No session found, redirecting to signin");
      redirect("/signin");
    }

    // Check if user exists in session
    if (!session.user) {
      console.log("No user in session, redirecting to signin");
      redirect("/signin");
    }

    // Check if user is admin
    if (!session.user.isAdmin) {
      console.log("User is not admin, redirecting to home");
      redirect("/");
    }

    console.log("Admin session:", {
      userId: session.user.id,
      email: session.user.email,
      isAdmin: session.user.isAdmin,
      name: session.user.name,
    });

    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <label>Welcome {session.user.name}</label>

        <div className="max-w-2xl m-2">
          <Link href="/admin/orders">
            <Custombutton
              bg={"bg-gray-200"}
              text={"View Active Orders"}
              size={"lg"}
            />
          </Link>
        </div>
        <div className="max-w-2xl  m-2">
          <Custombutton
            bg={"bg-gray-200"}
            text={"Edit Active Orders"}
            size={"lg"}
          />
        </div>
        <div className="max-w-2xl  m-2">
          <Link href="/admin/add-menu-item">
            <Custombutton
              bg={"bg-gray-200"}
              text={"Add menu item"}
              size={"lg"}
            />
          </Link>
        </div>
        <div className="max-w-2xl  m-2">
          <Link href="/admin/edit-menu-item">
            <Custombutton
              bg={"bg-gray-200"}
              text={"Edit menu item"}
              size={"lg"}
            />
          </Link>
        </div>
        <div className="max-w-2xl  m-2">
          <Custombutton bg={"bg-gray-200"} text={"Edit Users"} size={"lg"} />
        </div>
        <div className="max-w-2xl  m-2">
          <Custombutton bg={"bg-gray-200"} text={"Users list"} size={"lg"} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin page error:", error);

    // Return a user-friendly error page instead of crashing
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Admin Access Error
          </h1>
          <p className="text-gray-600 mb-4">
            There was an error accessing the admin panel. Please try again or
            contact support.
          </p>
          <Link href="/">
            <Custombutton
              bg={"bg-blue-500"}
              text={"Return to Home"}
              size={"lg"}
            />
          </Link>
        </div>
      </div>
    );
  }
}
