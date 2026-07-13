import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import StaggeredMenu from "./StaggeredMenu";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Staggered overlay navigation menu + topbar header */}
      <StaggeredMenu />
      
      <main className="flex-1 overflow-x-hidden p-8 pt-24">
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
  );
}
