import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional but good to be explicit
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // <-- simplest with Next.js API routes
    credentials: "include", // send NextAuth cookies
  }),
  tagTypes: ["Order"], // declare tags you’ll use
  endpoints: () => ({}), // <-- IMPORTANT: provide endpoints (even empty)
});
