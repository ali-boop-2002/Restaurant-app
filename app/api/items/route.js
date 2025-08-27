import connectDB from "@/config/database";
import Items from "@/models/Item";

export async function GET() {
  try {
    await connectDB();
    const data = await Items.find({}).lean();
    return Response.json(data);
  } catch (err) {
    console.error(err);
  }
}
