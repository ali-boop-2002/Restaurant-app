"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const [error, setError] = useState(false);
  // console.log(session);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError(true);
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center ">
      <div className=" max-w-4xl p-4">
        <h1 className="text-4xl">Login to your account</h1>
      </div>
      <span>Enter Your email below to login to your account</span>
      {error && (
        <div className=" text-red-500 text-2xl p-2">
          Invalid email or password
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className="flex flex-col max-w-4xl">
          <label className="text-2xl min-w-2xs">Email</label>
          <input
            type="email"
            placeholder="@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${
              error && `ring-4 ring-red-500`
            } p-4 border-2 border-gray-100 rounded-2xl focus:ring-3 focus:ring-yellow-400 focus:outline-none`}
          ></input>
          <label className="text-2xl min-w-2xs">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
            className={`${
              error && `ring-4 ring-red-500`
            } p-4 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:outline-none`}
          ></input>
        </div>
        <button
          type="submit"
          className="px-4 text-2xl bg-yellow-400 rounded m-4 hover:cursor-pointer "
        >
          Login
        </button>
        <Link href="/signup">
          <button className="px-4 text-2xl bg-yellow-400 rounded m-4 hover:cursor-pointer ">
            Sign up
          </button>
        </Link>
      </form>

      <span className="">Or continue with </span>
      <button
        className="bg-gray-200 rounded hover:cursor-pointer  "
        onClick={() => signIn("google")}
      >
        <div className="flex flex-row items-center justify-center p-4 text-2xl gap-2">
          Login in with
          <FaGoogle size={50} />
        </div>
      </button>
    </div>
  );
}

export default page;
