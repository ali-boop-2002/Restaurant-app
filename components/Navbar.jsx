"use client";
import { ShoppingCart } from "lucide-react";
import { RxExit } from "react-icons/rx";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useSelector((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="bg-yellow-400  sm:min-h-10 flex justify-between text-center items-center sm:fixed top-0 w-full z-20 shadow-md">
      <Link href="/">
        <div className="sm:text-2xl sm:m-4 hover:cursor-pointer ">
          Pakistani chai dhaba
        </div>
      </Link>
      <div className="sm:m-4 flex flex-row">
        {session ? (
          <>
            <div className="mr-2 hover:cursor-pointer rounded-2xl p-1">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:cursor-pointer">
                    Welcome {session.user.name}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white hover:cursor-pointer ">
                    <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100">
                      Profile
                    </DropdownMenuItem>
                    {session.user.isAdmin && (
                      <Link href="/admin">
                        <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100">
                          Admin Panel
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link href="/my-orders">
                      <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100">
                        Orders
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100">
                      {" "}
                      Team
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100">
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:cursor-pointer hover:bg-gray-100"
                      onClick={() => signOut("google")}
                    >
                      sign out
                      <RxExit />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        ) : (
          <Link href="/signin">
            <div className="mr-2 hover:cursor-pointer rounded-2xl p-1">
              Sign In / Sign up
            </div>
          </Link>
        )}

        <div className="p-1">
          <Link href="/menu/checkout">
            <span className="flex flex-row">
              <ShoppingCart />
              {cartItems.length >= 1 && (
                <p className="bg-black text-white rounded-full px-2">
                  {cartItems.length}
                </p>
              )}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
