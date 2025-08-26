import connectDB from "@/config/database";
import Items from "@/models/Item";

export async function GET({ params }) {
  const { id } = await context.params;

  await connectDB();
  const data = await Items.findById(id).lean();
  return Response.json(data);
}
