import { MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-amber-400 py-4 mt-auto z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center text-xl text-center gap-2">
        <div>Located at downtown Endicott</div>
        <div className="flex items-center gap-2">
          <MapPin size={24} /> 59 Washington Ave Endicott
        </div>
        <div>Contact: 111-222-333</div>
      </div>
    </footer>
  );
}

export default Footer;
