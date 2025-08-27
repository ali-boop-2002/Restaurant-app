import connectDB from "@/config/database";
import Items from "@/models/Item";

export async function GET(req, res) {
  await connectDB();
  console.log(req);
  return Response.json(req);
}
