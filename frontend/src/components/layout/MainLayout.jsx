import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
