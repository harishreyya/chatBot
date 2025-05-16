// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button, Modal } from "flowbite-react";
// import { FiUser } from "react-icons/fi";
// import { FaRobot} from "react-icons/fa";
// import SkeletonLoader from "@/components/SkeletonLoader";
// import Link from "next/link";

// export default function Home() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.replace("/auth/login");
//     }
//   }, [status, router]);

//  if (status === "loading") return <SkeletonLoader />;


//   const handleLogout = () => {
//     setIsLogoutModalOpen(false);
//     signOut({ redirect: true, callbackUrl: "/auth/login" });
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex flex-col">

//   <header className="flex items-center justify-between bg-gray-600 px-8 py-4 shadow-md ">
//   <div className="flex items-center gap-3">
//     <FaRobot className="h-8 w-8 text-green-400" />
//     <span className="text-2xl font-bold text-white">AI Models</span>
//     <span className="ml-4 pl-4 border-gray-600 text-lg text-gray-300">Dashboard</span>
//   </div>

//   <Link href="/chat" className="px-4 py-2 bg-green-600 text-white rounded">
//   Go to Chatbot
// </Link>

//   {session?.user?.email && (
//     <div className="relative">
//       <button
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//         className="flex items-center focus:outline-none hover:opacity-80 transition"
//       >
//         <FiUser className="h-8 w-8 text-white cursor-pointer" />
//       </button>

//       {isMenuOpen && (
//         <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//           <div className="p-4 border-b text-gray-800 text-sm">
//             {session.user.email}
//           </div>
//           <button
//             onClick={() => {
//               setIsMenuOpen(false);
//               setIsLogoutModalOpen(true);
//             }}
//             className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg cursor-pointer"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   )}
// </header>


//       <main className="flex-1 flex flex-col items-center justify-center space-y-4">
//         <h2 className="text-4xl font-bold text-blue-700">
//           Welcome home, {session?.user?.email}!
//         </h2>
//       </main>

//       <Modal
//   show={isLogoutModalOpen}
//   onClose={() => setIsLogoutModalOpen(false)}
//   size="sm"
//   popup
// >
//   <div className="p-4">
//     <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Logout</h3>
//     <p className="text-sm text-gray-600 mb-4">
//       Are you sure you want to log out from your account?
//     </p>
//     <div className="flex justify-end gap-2">
//       <Button color="gray" onClick={() => setIsLogoutModalOpen(false)} className="cursor-pointer">
//         Cancel
//       </Button>
//       <Button color="red" onClick={handleLogout} className="cursor-pointer">
//         Yes, Logout
//       </Button>
//     </div>
//   </div>
// </Modal>
//     </div>
//   );
// }

// -------------------


import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <h2 className="text-4xl font-bold text-blue-700">
            Welcome to your Dashboard!
          </h2>
        </div>
    </Layout>
  );
}


