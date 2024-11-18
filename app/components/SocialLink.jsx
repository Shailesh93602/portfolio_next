import { motion } from "framer-motion";

export default function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-primary text-text-secondary hover:bg-primary hover:text-white transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-white"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
      />
      <motion.div
        className="relative z-10"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.a>
  );
}
