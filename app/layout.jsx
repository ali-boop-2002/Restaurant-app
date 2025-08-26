import "@/assets/styles/globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import ClientProviders from "@/components/ClientProviders";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import store from "@/store";
import { Winky_Rough } from "next/font/google";
import { Provider } from "react-redux";

const winky = Winky_Rough({
  subsets: ["latin"],
  weight: ["400", "700", "900"], // available weights
  variable: "--font-winky-rough",
});

function layout({ children }) {
  return (
    <html lang="en" className={winky.className}>
      <body className="flex flex-col min-h-screen relative ">
        <ClientProviders>
          <Navbar />
          <main className="sm:pt-16">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

export default layout;
