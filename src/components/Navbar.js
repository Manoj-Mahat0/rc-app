import React, { useState } from "react";
import { Home, Gamepad2, Video, Menu, X } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import Link

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: <Home className="w-4 h-4" />, to: "/" },
    { name: "RC Controller", icon: <Gamepad2 className="w-4 h-4" />, to: "/" },
    { name: "Live Streaming", icon: <Video className="w-4 h-4" />, to: "/live" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-600 text-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <Gamepad2 className="w-6 h-6 text-yellow-300" />
          RC Controller
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium items-center">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
              >
                {item.icon} {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 text-sm font-medium">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon} {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
