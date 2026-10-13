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

export const staggerContainer = (staggerChildren: number = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
    },
  },
});

/**
 * The props for a block that fades in once, when it first scrolls into view.
 * Spread onto a `motion.*` element: `<motion.div {...fadeInOnScroll(0.3)} />`.
 */
export const fadeInOnScroll = (delay: number = 0) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
  variants: fadeIn(delay),
});
