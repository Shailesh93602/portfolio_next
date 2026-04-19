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
          className="text-foreground transition-colors hover:text-primary"
        >
          {/*
            The icon prop is always a decorative SVG from react-icons.
            The accessible name comes from the outer Button's aria-label
            — so hide the SVG from the a11y tree to avoid axe's
            svg-img-alt violation on role="img" without title/label.
          */}
          <span aria-hidden="true" className="inline-flex">
            {icon}
          </span>
        </a>
      </Button>
    </motion.div>
  );
};

export default SocialLink;
