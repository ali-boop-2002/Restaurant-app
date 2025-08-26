"use client";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { addToCart } from "@/slices/cartSlice";
import { Suspense, useState } from "react";

function MainMenuItemCard({ item }) {
  const [count, setCount] = useState(1);
  const [specialInst, setSpecialInst] = useState("");
  const [selectedSides, setSelectedSides] = useState([]);
  const [drinkSize, setDrinkSize] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleSideChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSides((prev) => [...prev, value]);
    } else {
      setSelectedSides((prev) => prev.filter((side) => side !== value));
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: item._id,
        name: item.name,
        qty: count,
        image: item.image[0],
        specialInst,
        selectedSides,
        drinkSize,
        price: item.price,
      })
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="m-4 flex max-w-xl flex-row border-1 border-gray-100 rounded relative hover:border-gray-200 hover:cursor-pointer">
          <div className="relative w-[170px] h-[200px] rounded-2xl overflow-hidden shrink-0">
            <Image
              src={item.image[0]}
              alt={item.name}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
          <div>
            <div className="m-2 font-bold">{item.name}</div>
            <div className="m-2">{item.description}</div>
            <div className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
              <Plus size={24} />
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-white h-[70vh] sm:h-[90vh] overflow-y-auto">
        <DialogTitle className="sm:text-3xl font-light">
          {item.name}
        </DialogTitle>
        <DialogDescription className="sm:text-xl">
          {item.description}
        </DialogDescription>
        <Image
          src={item.image[0]}
          height={100}
          width={500}
          alt={item.name}
          className="rounded "
        />
        {item.hasSides && (
          <fieldset>
            <>
              <legend>Please choose a side</legend>
              <div className="flex flex-col">
                {item.sides.map((side, index) => (
                  <label
                    key={index}
                    className="hover:cursor-pointer border-b-2 pb-2 pt-2 border-gray-100"
                  >
                    <input
                      type="checkbox"
                      name="side"
                      value={side}
                      onChange={handleSideChange}
                      className="mr-2"
                    />
                    <span>{side}</span>
                  </label>
                ))}
              </div>
            </>
          </fieldset>
        )}
        {item.hasSize && (
          <fieldset>
            <>
              <legend>Please choose size</legend>
              <div className="flex flex-col">
                {item.size.map((size, index) => (
                  <label
                    key={index}
                    className="hover:cursor-pointer border-b-2 pb-2 pt-2 border-gray-100"
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      onChange={(e) => setDrinkSize(e.target.value)}
                      className="mr-2"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </>
          </fieldset>
        )}
        {/* <h2>Preferences</h2> */}
        <textarea
          placeholder="Add Special Instruction"
          value={specialInst}
          onChange={(e) => setSpecialInst(e.target.value)}
          className="flex flex-row justify-between  border-2 p-4 h-20 rounded border-gray-200 hover:border-gray-300"
        >
          {/* <h3></h3>
          <ArrowRight /> */}
        </textarea>
        <div className=" flex flex-row justify-center items-center ">
          <span className="bg-gray-200 rounded-4xl  flex flex-row m-5 w-[150px]">
            <button
              className="bg-black text-white rounded-full m-2 px-4 py-2 hover:cursor-pointer hover:bg-gray-600"
              onClick={() => setCount(count > 1 ? count - 1 : 1)}
            >
              -
            </button>
            <div className=" px-4 flex items-center justify-center text-center w-[20px]">
              <h2>{count}</h2>
            </div>
            <button
              className="bg-black text-white rounded-full m-2 px-4 py-2 hover:cursor-pointer hover:bg-gray-600"
              onClick={() => setCount(count + 1)}
            >
              +
            </button>
          </span>
          <button
            className="bg-black text-white rounded-4xl transition-colors p-2 hover:cursor-pointer hover:bg-gray-800"
            onClick={() => {
              handleAddToCart();
            }}
          >
            Add to cart
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MainMenuItemCard;
