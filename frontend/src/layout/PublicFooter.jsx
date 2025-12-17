import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-siladan.png";

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#053F5C] text-[#9FE7F5] dark:text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={Logo}
                alt="Siladan Logo"
                className="w-20 h-20 object-contain"
              />
              <span className="text-xl xl:text-2xl font-bold text-white dark:text-white">
                SILADAN
              </span>
            </Link>
            <p className="text-sm xl:text-base">
              &copy; {currentYear} SILADAN. All right reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-base xl:text-lg font-semibold mb-3 text-white dark:text-white">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 gap-1 text-sm xl:text-base grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 whitespace-nowrap">
              <li>
                <Link
                  to="/complaint"
                  className="hover:underline hover:text-white"
                >
                  Form Pengaduan
                </Link>
              </li>
              <li>
                <Link
                  to="/track-ticket"
                  className="hover:underline hover:text-white"
                >
                  Pelacakan Tiket
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:underline hover:text-white">
                  Pusat Informasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h4 className="text-base xl:text-lg font-semibold mb-3 text-white dark:text-white">
              Hubungi Kami
            </h4>
            <p className="text-sm xl:text-base">
              Jl. Ketintang No.103, Surabaya, Jawa Timur
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
