import { registerUser } from "../actions/registerUser";

function page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form className="  p-5 rounded-2xl" action={registerUser}>
        <div className="flex flex-row items-center justify-center">
          <h2 className="text-4xl m-3">Sign Up</h2>
        </div>
        <div className="flex flex-col text-2xl">
          <label>Full Name</label>
          <input
            name="name"
            placeholder="please enter full name "
            className="border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          ></input>
        </div>
        <div className="flex flex-col text-2xl">
          <label>Email address</label>
          <input
            name="email"
            placeholder="enter email address"
            className="border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          ></input>
        </div>
        <div className="flex flex-col text-2xl">
          <label>Password</label>
          <input
            name="password"
            placeholder="please enter password"
            className="border-2 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          ></input>
        </div>
        <button
          type="submit"
          className="px-4 text-2xl bg-yellow-400 rounded m-4 hover:cursor-pointer "
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default page;
