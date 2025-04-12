import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        asChild
        aria-label={label}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary hover:text-primary transition-colors"
        >
          {icon}
        </a>
      </Button>
    </motion.div>
  );
};

export default SocialLink;
