import { Variants } from "framer-motion";

export const fadeIn = (delay: number = 0) => ({
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
    },
  },
});

export const slideIn = (
  direction: "left" | "right" | "up" | "down" = "left",
  delay = 0
): Variants => ({
  hidden: {
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});

export const staggerContainer = (staggerChildren: number = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
    },
  },
});

export const textVariant = (delay = 0): Variants => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
});

export const zoomIn = (delay = 0, scale = 0.5): Variants => ({
  hidden: {
    scale,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration: 0.5,
      ease: "easeOut",
    },
  },
});

export const rotateIn = (delay = 0): Variants => ({
  hidden: {
    rotate: -180,
    opacity: 0,
  },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      delay,
      duration: 0.7,
      bounce: 0.3,
    },
  },
});
