"use client";

import MapSelector from "@/components/MapSelector";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import getNextDays from "@/utils/date";
import { getTimeSlots } from "@/utils/time";
import Payment from "@/components/Payment";
import TotalPrice from "@/components/TotalPrice";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/slices/orderApiSlice";
import { clearCart } from "@/slices/cartSlice";

function page() {
  const router = useRouter();
  const { cartItems } = useSelector((s) => s.cart);
  const { status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'
  const dispatch = useDispatch();
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Redirects – keep them in one effect; no early returns between hooks
  useEffect(() => {
    if (!mounted) return;
    if (!orderCompleted) {
      if (!cartItems?.length) {
        router.replace("/menu/checkout");
        return;
      }
    }
    if (status === "unauthenticated") {
      router.replace("/menu/checkout");
    }
  }, [mounted, cartItems?.length, status, router]);

  // Gate rendering until ready (avoids Stripe creating intents for $0)
  const shouldBlock = !mounted || status === "loading" || !cartItems?.length;

  // Pricing (memoized so re-renders are cheap)
  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cartItems]
  );
  const fees = subtotal * 0.012;
  const delivery = subtotal * 0.1;
  const amountDue = subtotal + fees + delivery;
  const amountCents = Math.round(amountDue * 100);

  // UI state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addressBoxOpen, setAddressBoxOpen] = useState(false);
  const [active, setActive] = useState("");
  const [secondActive, setSecondActive] = useState("");
  const [day, setDay] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [method, setMethod] = useState("Delivery");
  const [pickupTime, setPickupTime] = useState("Standard");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [formError, setFormError] = useState(false);

  const [createOrder] = useCreateOrderMutation();
  const [payNow, setPayNow] = useState(false);

  const time = getTimeSlots(11, 20);
  const date = getNextDays(5);

  const handlePlaceOrder = async () => {
    if (method === "Delivery" && !address && !selectedLocation) {
      setFormError(true);
      return;
    }
    if (pickupTime === "Schedule" && (!hour || !newDate)) {
      setFormError(true);
      return;
    }
    if (!phone || !email || !firstName || !lastName) {
      setFormError(true);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      product: item._id,
      drinkSize: item.drinkSize || null,
      selectedSides: item.selectedSides || null,
      specialInst: item.specialInst || null,
    }));

    const orderData = {
      orderItems,
      orderForDeliver: method === "Delivery",
      orderForPickup: method === "Pickup",
      deliveryAddress: newAddress || selectedLocation, // make sure schema matches (string vs object)
      isPaid: false,
      totalPrice: amountDue,
      taxPrice: fees,
      pickupTime: hour && newDate && day ? { hour, newDate, day } : null,
    };

    try {
      await createOrder(orderData).unwrap();
      setPayNow(true); // triggers Payment -> stripe.confirmPayment
    } catch (err) {
      console.error(err);
      setFormError(true);
    }
  };

  const handlePaymentDone = (result) => {
    setPayNow(false);
    if (result?.ok) {
      dispatch(clearCart());
      setOrderCompleted(true);
      router.push("/my-orders");
    } else {
      // keep UI open for retry or show toast
    }
  };

  const handleAddressSelected = ({ address, lat, lng }) => {
    setSelectedLocation({ address, lat, lng });
  };

  // const updateAddress = (address) => {
  //   setAddress(address);
  // };
  // const foundAddress = ({ address, lat, lng }) => {
  //   setSelectedLocation({ address, lat, lng });
  // };
  // const time = getTimeSlots(11, 20);

  // const date = getNextDays(5);

  return (
    <div className="min-h-screen">
      {shouldBlock ? (
        <p>loading</p>
      ) : (
        <div className="flex flex-col md:flex-row overflow-hidden justify-center ">
          <div className="flex flex-col container mx-auto max-w-4xl font-sans ">
            <div className="grid grid-cols-8 border-b-2 pb-2 border-gray-200 pt-2 ">
              <div className="col-span-2">
                <h1 className=" font-sans sm:text-2xl">Method</h1>
              </div>

              <div className="flex flex-col col-span-6  sm:text-xl font-sans ">
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="Delivery"
                    checked={method === "Delivery"}
                    onChange={(e) => setMethod(e.target.value)}
                    className="m-2"
                  />
                  <span>Delivery</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="Pickup"
                    checked={method === "Pickup"}
                    onChange={(e) => setMethod(e.target.value)}
                    className="m-2"
                  />
                  <span>Pickup</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-8 border-b-2 pb-2 border-gray-200  pt-2">
              <div className="col-span-2">
                <h1 className=" font-sans sm:text-2xl">
                  {method === "Delivery" ? "Delivery Time" : "Pickup Time"}
                </h1>
              </div>
              <div className="flex flex-col col-span-6   sm:text-xl font-sans">
                <label>
                  <input
                    type="radio"
                    name="pickup"
                    value={"Standard"}
                    onChange={(e) => {
                      setPickupTime(e.target.value);
                      setScheduleOpen(false);
                    }}
                    checked={pickupTime === "Standard"}
                    className="m-2"
                  />
                  <span>Standard</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="pickup"
                    value={"Schedule"}
                    onChange={(e) => {
                      setPickupTime(e.target.value);
                      setScheduleOpen(true);
                    }}
                    checked={pickupTime === "Schedule"}
                    className="m-2"
                  />
                  <span>
                    Schedule{" "}
                    {day && newDate && hour && pickupTime !== "Standard" && (
                      <span className=" rounded-4xl p-1">
                        {`${day}, ${newDate}, ${hour}`}
                      </span>
                    )}
                  </span>
                </label>
                <div>
                  <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogContent className="bg-white md:min-w-xl  font-sans">
                      <DialogHeader>
                        <DialogTitle className="font-sans">
                          Schedule your order
                        </DialogTitle>
                        <h1 className="font-sans">Select a delivery date</h1>

                        {/* Use asChild so it doesn't render a <p> */}
                        <DialogDescription asChild>
                          <div>
                            <div className="flex flex-row justify-center items-center rounded-3xl bg-gray-100 mx-auto font-sans">
                              {date.map((d, index) => (
                                <div key={index}>
                                  <div
                                    className={`text-sm flex flex-col justify-center w-[60px] md:w-[105px] items-center hover:bg-gray-400  rounded-3xl hover:cursor-pointer transition-colors focus:bg-gray-700 ${
                                      active === index &&
                                      "bg-gray-900 text-white hover:bg-gray-900"
                                    }`}
                                    onClick={() => {
                                      setActive(index);
                                      setDay(d.dayName);
                                      setNewDate(d.dateString);
                                    }}
                                  >
                                    <div> {d.dayName}</div>

                                    <div> {d.dateString}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <label className="text-xl font-bold my-1">
                              Desired delivery time
                            </label>
                            <div className="grid grid-cols-2 my-4">
                              {time.map((hour, index) => (
                                <div key={index}>
                                  <div
                                    className={` m-1 rounded-3xl text-xl flex justify-center items-center hover:cursor-pointer ${
                                      index === secondActive
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 hover:bg-gray-400"
                                    }`}
                                    onClick={() => {
                                      setSecondActive(index), setHour(hour);
                                    }}
                                  >
                                    <span>{hour}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-8 border-b-2 pb-2 border-gray-200 pt-2   ">
              <div className="sm:col-span-2 ">
                <h1 className=" font-sans sm:text-2xl">Pickup address</h1>
              </div>
              <div className="flex flex-col col-span-8 sm:col-span-6 px-4 sm:px-0 not-first:text-xl font-sans rounded-2xl h-[400px] ">
                <MapSelector
                  onAddressSelected={handleAddressSelected}
                  methodType={method}
                  getAddress={address}
                />
              </div>
            </div>
            {method === "Pickup" ? (
              <div className="grid grid-cols-8 border-b-2 pb-2 border-gray-200 pt-2  ">
                <div className="col-span-2 "></div>
                <div className="flex flex-col col-span-6  ">
                  <h2 className="sm:text-2xl">Store Address</h2>
                  <span className="mt-2">Oak Hill Ave Endicott, NY 13760</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-8 border-b-2 pb-2 border-gray-200 pt-2  ">
                <div className="col-span-2 "></div>
                <div className="flex flex-col col-span-6  ">
                  <h2 className="sm:text-xl">
                    {selectedLocation
                      ? selectedLocation.address.replace(", United States", "")
                      : "Please select address for delivery"}
                  </h2>
                  <span className="mt-2">
                    Drop-off: Leave it at my door{" "}
                    <span
                      className="font-bold hover:cursor-pointer hover:bg-gray-100 transition-colors rounded-3xl"
                      onClick={() => setAddressBoxOpen(true)}
                    >
                      Add / edit
                    </span>
                    <Dialog
                      open={addressBoxOpen}
                      onOpenChange={setAddressBoxOpen}
                    >
                      <DialogContent className="bg-white">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const trimmed = newAddress.trim();
                            if (!trimmed) return;
                            setAddress(trimmed); // this triggers MapSelector's geocode effect
                            setAddressBoxOpen(false); // close dialog
                            // optional: setNewAddress("");
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle className="font-sans text-3xl">
                              Enter your delivery address
                            </DialogTitle>
                            <h2 className="font-sans text-2xl">
                              Street Address
                            </h2>
                            <input
                              type="text"
                              placeholder="Enter Address"
                              className="bg-gray-100 p-2"
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                            />
                            <h2 className="font-sans text-2xl">
                              Apartment / Suite
                            </h2>
                            <input
                              type="text"
                              placeholder="Enter your apartment number or suite"
                              className="bg-gray-100 p-2"
                            />
                            <h2 className="font-sans text-2xl">
                              Instructions for driver
                            </h2>
                            <input
                              type="text"
                              placeholder="eg. Leave at the door..."
                              className="bg-gray-100 p-2"
                            />
                            <button
                              type="submit"
                              className="bg-black text-white rounded-4xl p-1 my-4 hover:bg-gray-600 hover:cursor-pointer"
                            >
                              save
                            </button>
                          </DialogHeader>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </span>
                </div>
              </div>
            )}
            <div className="sm:grid  sm:grid-cols-8 border-b-2 pb-2 px-2 sm:px-0 border-gray-200 pt-2 ">
              <div className="sm:col-span-2  ">
                <h1 className=" font-sans sm:text-2xl text-center justify-center ">
                  Contact and payment
                </h1>
              </div>
              <div className="flex flex-col sm:col-span-6 col-span-8 container mx-auto px-1 overflow-scroll   sm:text-xl font-sans">
                <div className="flex flex-row  justify-start  space-x-4 ">
                  <div className="flex flex-col">
                    <label htmlFor="countryCode">Country:</label>
                    <select
                      id="countryCode"
                      name="countryCode"
                      className="bg-gray-100 sm:p-2 rounded focus:outline-2 focus:outline-black"
                    >
                      <option value="US">+1(US)</option>
                      <option value="CA">+1(CA)</option>
                    </select>
                  </div>
                  <div className="flex flex-col  ">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      className="bg-gray-100 sm:p-2 rounded focus:outline-2 focus:outline-black"
                      id="phoneNumber"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col   ">
                  <label htmlFor="email">Email</label>
                  <input
                    className="bg-gray-100 sm:p-2 rounded focus:outline-2 focus:outline-black"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-row  justify-start sm:justify-start space-x-1 sm:space-x-4 ">
                  <div className="flex flex-col">
                    <label htmlFor="firstname">First Name</label>
                    <input
                      className="bg-gray-100 sm:p-2 w-[170px] sm:w-full rounded focus:outline-2 focus:outline-black"
                      id="firstname"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                      className="bg-gray-100 sm:p-2 w-[170px] sm:w-full rounded focus:outline-2 focus:outline-black"
                      id="lastname"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col my-4">
                  <label>Card Details</label>
                  <Payment
                    amountCents={amountCents}
                    payNow={payNow}
                    onDone={handlePaymentDone}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <TotalPrice
              subtotal={subtotal.toFixed(2)}
              deliveryFee={delivery.toFixed(2)}
              fees={fees.toFixed(2)}
              amountDue={amountDue.toFixed(2)}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
