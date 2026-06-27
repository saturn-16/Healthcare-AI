import { motion } from "framer-motion";

export default function HumanBodySVG({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Pulsing glow behind the body */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main body image with floating animation */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.img
          src="/human-body.png"
          alt="Human Body Diagram"
          className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            mixBlendMode: "multiply",
          }}
        />
      </motion.div>

      {/* Scanning line animation */}
      <motion.div
        className="absolute left-[10%] right-[10%] h-[2px] z-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(59,130,246,0.5), rgba(59,130,246,0.3), transparent)",
          boxShadow: "0 0 15px rgba(59,130,246,0.3)",
        }}
        animate={{
          top: ["10%", "90%", "10%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400 pointer-events-none z-20"
          style={{
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            left: `${15 + (i * 13) % 70}%`,
            top: `${20 + (i * 17) % 60}%`,
          }}
          animate={{
            y: [0, -20 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
}
