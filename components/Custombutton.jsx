function Custombutton({ bg, size, text }) {
  let newSize;
  let textSize;
  if (size === "md") {
    newSize = "min-w-2xs";
    textSize = "text-3xl";
  }
  if (size === "sm") {
    newSize = "min-w-25";
    textSize = "text-2xl";
  }
  if (size === "lg") {
    newSize = "min-w-3xs";
    textSize = "text-4xl";
  }
  return (
    <div
      className={`${bg} ${newSize} ${textSize} flex justify-center hover:cursor-pointer hover:shadow-2xl hover:shadow-amber-300 rounded`}
    >
      {text}
    </div>
  );
}

export default Custombutton;
