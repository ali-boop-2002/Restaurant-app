import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import Custombutton from "@/components/Custombutton";
import Link from "next/link";
import connectDB from "@/config/database";
import Items from "@/models/Item";
import { ArrowBigLeft } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session.user?.isAdmin) {
    redirect("/");
  }

  console.log(session);
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
          <Custombutton bg={"bg-gray-200"} text={"Add menu item"} size={"lg"} />
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
}
