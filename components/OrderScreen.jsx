"use client";
import {
  useGetOrderByIdQuery,
  useUpdateOrderByIdMutation,
} from "@/slices/orderApiSlice";
import LoadingSpinner from "./LoadingSpinner";

function OrderScreen({ orderId }) {
  // const [status, setStatus] = useState("");
  const {
    data: myOrder,
    isLoading: Loading,
    error: isError,
  } = useGetOrderByIdQuery(orderId);

  const [updateOrderById, { isLoading: updating }] =
    useUpdateOrderByIdMutation();

  const getNextStatus = (current) => {
    switch (current) {
      case "Not Confirmed":
        return "Confirmed";
      case "Confirmed":
        return "Ready For Pickup";
      case "Ready For Pickup":
        return "Served";
      // sensible default
    }
  };

  const handleConfirmOrder = async () => {
    const next = getNextStatus(myOrder?.orderStatus);
    try {
      const result = await updateOrderById({
        id: orderId,
        data: { orderStatus: next },
      }).unwrap();
    } catch (err) {
      console.error("Error details:", err.data || err.message);
      console.log(err);
    }
  };

  const orderLength = myOrder?.orderItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );
  if (Loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col col-span-12 min-h-screen relative bg-white">
      <div className="border-b-4 border-gray-100 pb-6 p-4 flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-4  ">
          <h1 className="text-2xl">Order# {orderId}</h1>
          <h2 className="text-2xl text-gray-500">
            {orderLength} {orderLength > 1 ? "Items" : "Items"}
          </h2>
        </div>
        <h2 className="text-red-500 font-bold">{myOrder?.user.email}</h2>
      </div>

      {myOrder?.orderItems.map((item) => (
        <div
          key={item._id}
          className="border-b-2 border-gray-100 pb-2 justify-center items-center"
        >
          <div className="p-4 flex flex-col justify-center ">
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl">
                <span className="font-bold">{item.qty}x </span>
                {item.name}
              </h1>
              <h1 className="text-2xl text-gray-600">
                ${item.price * item.qty}
              </h1>
            </div>
            <div className="flex flex-row gap-x-2 mt-5">
              {item.selectedSides &&
                item.selectedSides.map((side, index) => (
                  <p key={index} className="bg-gray-200 rounded-full px-2">
                    {" "}
                    {side}
                  </p>
                ))}{" "}
            </div>
            {item.specialInst && (
              <div className=" mt-4 flex flex-row space-x-2 text-red-500 font-bold">
                <h1>Special Inst:</h1>
                <p className="text-gray-600"> {item.specialInst}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-col text-xl p-4 mb-15 ">
        <div className="flex flex-row justify-end space-x-4 items-center ">
          <div className="grid grid-cols-8">
            <div className="col-span-4">
              <h1>Tax</h1>
              <h1>Total</h1>
            </div>

            <div className="col-span-4">
              <h1>${myOrder?.taxPrice.toFixed(2)}</h1>
              <h1 className="font-bold">${myOrder?.totalPrice.toFixed(2)}</h1>
            </div>
          </div>
        </div>
      </div>
      <button
        className={`absolute bottom-0 mt-5 ${
          myOrder?.orderStatus === "Confirmed" ? "bg-green-500" : "bg-red-500"
        } p-4 w-full text-white text-2xl hover:cursor-pointer font-bold text-center active:bg-red-700 
        }`}
        onClick={updating ? undefined : handleConfirmOrder}
        disabled={myOrder?.orderStatus === "Served"}
      >
        <h2>{myOrder?.orderStatus}</h2>
      </button>
    </div>
  );
}

export default OrderScreen;
