import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-6">
      <div className="max-w-7xl mx-auto p-4 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} CineSanchika. All rights reserved.
      </div>
    </footer>
  );
}
