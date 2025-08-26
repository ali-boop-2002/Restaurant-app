"use client";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "300px 500px",
};

function LoadingSpinner() {
  return (
    <ClipLoader
      color="#FFDE21"
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
}

export default LoadingSpinner;
