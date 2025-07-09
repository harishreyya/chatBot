"use client";

import { useEffect, useState, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "flowbite-react";
import { FiUser } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import Link from "next/link";
import SkeletonLoader from "@/components/SkeletonLoader";
import "../app/chat/[chatId]/chat.css"
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return <SkeletonLoader />;

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 flex flex-col ">
      <header className="header-container flex items-center justify-between p-4 md:p-6 shadow-lg z-5 ">
        <Link href="/" className="flex items-center gap-3">
          <FaRobot className="h-9 w-9 text-white drop-shadow-md" />
          <span className="text-3xl font-extrabold text-white tracking-wide">
            Ask Any ✍️
          </span>
        </Link>

        {session?.user?.email && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center focus:outline-none hover:scale-105 transition-transform"
            >
              <FiUser className="h-8 w-8 text-white cursor-pointer" />
            </button>

            {isMenuOpen && (
              <div className="menu-dropdown absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden transition-transform duration-300">
                <div className="p-3 border-b text-gray-800 text-sm font-medium bg-gray-200">
                  {session.user.email}
                </div>
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-700 text-sm font-medium hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-3 text-green-700 text-sm font-medium hover:bg-red-200 "
                >
                  Chat Bot
                </Link>
                <Link
                  href="/textToImage"
                  className="block px-4 py-3 text-blue-700 text-sm font-medium hover:bg-blue-100 "
                >
                  Text to Image
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-200 hover:text-red-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <Modal show={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} size="sm" popup className="bg-[rgba(0,0,0,0.7)]">
        <div className="p-4 ">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
          <p className="text-sm text-gray-600 mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsLogoutModalOpen(false)} className="cursor-pointer text-white bg-gray-600">
              Cancel
            </Button>
            <Button onClick={handleLogout} className="cursor-pointer text-white bg-red-500">
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

