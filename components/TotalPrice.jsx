import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function TotalPrice({ subtotal, deliveryFee, fees, amountDue, onPlaceOrder }) {
  // const { cartItems } = useSelector((state) => state.cart);
  // const totalPrice = cartItems
  //   .map((item) => item.price * item.qty)
  //   .reduce((curr, acc) => curr + acc, 0)
  //   .toFixed(2);

  // const estimatedFeesAndTax = totalPrice * 0.012;
  // const deliveryFee = (totalPrice * 0.1).toFixed(2);
  // const amountDue = (
  //   Number(totalPrice) +
  //   Number(estimatedFeesAndTax) +
  //   Number(deliveryFee)4
  // ).toFixed(2);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="  md:h-screen border-l-2 flex bg-gray-100 justify-center md:justify-start items-center md:items-baseline border-2  border-gray-200 border-t-2 z-0  ">
      <div className="flex flex-col justify-center container min-w-sm items-center p-2 ">
        <button
          className="px-30 py-2 mt-10 rounded-4xl text-white bg-black"
          onClick={onPlaceOrder}
        >
          Place order
        </button>
        <div className=" flex flex-col w-full border-b-2 font-mono border-gray-200 pb-4 px-4 pt-4">
          <div className="flex  flex-row justify-between  items-center">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex  flex-row justify-between  items-center">
            <span>Delivery Fee</span>
            <span>${deliveryFee}</span>
          </div>
          <div className="flex  flex-row justify-between   items-center">
            <span>Fees & Estimated Tax</span>
            <span>${fees}</span>
          </div>
        </div>
        <div className=" flex flex-col w-full border-b-2 font-mono border-gray-200 pb-4 px-4 pt-4">
          <div className="flex  flex-row justify-between  items-center">
            <span>Total</span>
            <span>${amountDue}</span>
          </div>
        </div>
        <div className=" flex flex-col w-full font-mono border-gray-200 pb-4 px-4 pt-4">
          <div className="flex  flex-row justify-between  items-center">
            <span>Amount Due</span>
            <span>${amountDue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalPrice;
