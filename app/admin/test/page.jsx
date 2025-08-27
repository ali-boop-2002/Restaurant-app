import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function TestPage() {
  try {
    const session = await getServerSession(authOptions);

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Session Status:</h2>
            <pre className="bg-gray-100 p-4 rounded mt-2">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Environment Variables Check:
            </h2>
            <div className="bg-gray-100 p-4 rounded mt-2">
              <p>
                MONGODB_URI: {process.env.MONGODB_URI ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                NEXTAUTH_SECRET:{" "}
                {process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                NEXTAUTH_URL:{" "}
                {process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                GOOGLE_CLIENT_ID:{" "}
                {process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing"}
              </p>
              <p>
                GOOGLE_CLIENT_SECRET:{" "}
                {process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error in Test Page
        </h1>
        <pre className="bg-red-100 p-4 rounded">{error.message}</pre>
      </div>
    );
  }
}
