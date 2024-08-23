"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => pathname === path;
  return (
    <nav className="bg-gray-800  backdrop-blur-md text-white px-6 py-4 shadow-lg w-full z-10 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-semibold text-blue-600">
          MyPortfolio
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link
              href="/"
              className={`text-lg font-medium transition duration-200 ${
                isActive("/")
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-lg font-medium transition duration-200 ${
                isActive("/about")
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className={`text-lg font-medium transition duration-200 ${
                isActive("/blogs")
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/portfolio"
              className={`text-lg font-medium transition duration-200 ${
                isActive("/portfolio")
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`text-lg font-medium transition duration-200 ${
                isActive("/contact")
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "hover:text-blue-500"
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            className="text-3xl text-blue-600 focus:outline-none"
            onClick={toggleMenu}
          >
            <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`${
          menuOpen ? "block" : "hidden"
        } md:hidden bg-gray-800 text-center py-8 absolute top-full left-0 w-full space-y-6`}
      >
        <li>
          <Link
            href="/"
            className={`text-lg font-medium transition duration-200 ${
              isActive("/")
                ? "text-blue-500 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`text-lg font-medium transition duration-200 ${
              isActive("/about")
                ? "text-blue-500 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
            onClick={closeMenu}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/blogs"
            className={`text-lg font-medium transition duration-200 ${
              isActive("/blogs")
                ? "text-blue-500 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
            onClick={closeMenu}
          >
            Blogs
          </Link>
        </li>
        <li>
          <Link
            href="/portfolio"
            className={`text-lg font-medium transition duration-200 ${
              isActive("/portfolio")
                ? "text-blue-500 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
            onClick={closeMenu}
          >
            Portfolio
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className={`text-lg font-medium transition duration-200 ${
              isActive("/contact")
                ? "text-blue-500 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
            onClick={closeMenu}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
