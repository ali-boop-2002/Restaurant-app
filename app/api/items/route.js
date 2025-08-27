import connectDB from "@/config/database";
import Items from "@/models/Item";

export async function GET(req, res) {
  try {
    await connectDB();
    const data = Items.find({}).lean();
    return Response.json(data);
  } catch (err) {
    console.error(err);
  }
}
