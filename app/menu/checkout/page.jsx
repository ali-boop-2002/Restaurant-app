"use client";
import { removeFromCart, setQty } from "@/slices/cartSlice";
import { ShoppingCart, Trash, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function page() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") setSignedIn(true);
  }, [session, router]);

  const [signedIn, setSignedIn] = useState(false);

  const totalPrice = cartItems
    .map((item) => item.price * item.qty)
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

  console.log(totalPrice);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (cartItems.length === 0) {
    return (
      <>
        <div className=" hidden min-h-screen sm:flex flex-col text-center justify-center items-center">
          <span>
            <ShoppingCart size={200} />
          </span>
          <h1 className=" sm:text-7xl">your cart is empty</h1>
        </div>
        <div className=" sm:hidden min-h-screen flex flex-col text-center justify-center items-center">
          <span>
            <ShoppingCart size={100} />
          </span>
          <h1 className=" sm:text-7xl">your cart is empty</h1>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  ">
      <div className="container mx-auto  overflow-hidden mt-10 p-4 ">
        {cartItems.map((item) => (
          <div
            className="flex flex-row m-4  mx-auto  border-b-2 border-gray-100 pb-2 pt-2"
            key={item._id}
          >
            <Image
              src={item.image}
              width={100}
              height={25}
              alt="item.name"
              className="h-[100px] w-[200] rounded-2xl"
            />
            <div className="flex flex-row justify-between items-center w-full px-3">
              <div className="max-w-2xs ">
                <h1>{item.name}</h1>
                {item.specialInst && (
                  <p className="whitespace-pre-line break-words ">
                    {item.specialInst}
                  </p>
                )}
                {item.drinkSize && (
                  <p className="whitespace-pre-line break-words text-gray-700 ">
                    {item.drinkSize}
                  </p>
                )}
                <h2>$ {item.price}</h2>
              </div>
              <div className="flex flex-row  justify-center text-center items-center min-w-30 ">
                <div
                  className="bg-black text-white rounded-full h-7 w-7 min-h-7 min-w-7  flex justify-center items-center hover:cursor-pointer"
                  onClick={() => {
                    dispatch(setQty({ _id: item._id, qty: item.qty + 1 }));
                  }}
                >
                  <button>+</button>
                </div>
                <div className=" m-4 w-[20px] ">
                  <h3>{item.qty}</h3>
                </div>
                {item.qty > 1 ? (
                  <div
                    className="bg-black text-white rounded-full h-7 w-7  min-h-7 min-w-7  flex justify-center items-center "
                    onClick={() => {
                      dispatch(setQty({ _id: item._id, qty: item.qty - 1 }));
                    }}
                  >
                    <button className="hover:cursor-pointer">-</button>
                  </div>
                ) : (
                  <div className="bg-black text-white rounded-full h-7 w-7  min-h-7 min-w-7  flex justify-center items-center hover:cursor-pointer ">
                    <Trash2
                      size={16}
                      color="#FFFF"
                      strokeWidth={1.75}
                      onClick={() => {
                        dispatch(removeFromCart({ _id: item._id }));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href={"/menu/checkout/confirm-Checkout"}>
        <button
          className={`${
            signedIn
              ? "bg-yellow-400 text-gray-800 hover:bg-yellow-300"
              : "bg-red-500 text-white"
          } my-10  p-4 rounded-4xl  hover:cursor-pointer hover:shadow-2xl  hover:ring-4 transition-all hover:ring-yellow-100`}
          disabled={!signedIn || cartItems.length === 0}
        >
          <div className="flex flex-row space-x-1">
            <span>
              {signedIn ? "proceed to checkout" : "Please log in to proceed"}
            </span>{" "}
            <span className="w-[35px] text-center block"> {totalPrice}</span>
          </div>
        </button>
      </Link>
    </div>
  );
}

export default page;
