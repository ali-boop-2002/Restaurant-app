import connectDB from "@/config/database";
import Items from "@/models/Item";

export async function GET() {
  await connectDB();
  const data = await Items.find({}).lean();
  return Response.json(data);
}
