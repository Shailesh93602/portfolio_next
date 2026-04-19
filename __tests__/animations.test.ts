/**
 * Tests for lib/animations.ts — ensures animation variant objects are
 * well-formed so that runtime failures are caught by tests, not production.
 */
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";

describe("animations", () => {
  describe("fadeIn", () => {
    it("returns hidden and visible states", () => {
      const anim = fadeIn();
      expect(anim.hidden).toBeDefined();
      expect(anim.visible).toBeDefined();
    });

    it("hidden state starts with opacity 0", () => {
      expect(fadeIn().hidden.opacity).toBe(0);
    });

    it("visible state ends with opacity 1", () => {
      expect(fadeIn().visible.opacity).toBe(1);
    });

    it("respects the delay parameter", () => {
      const anim = fadeIn(0.5);
      expect((anim.visible as any).transition?.delay).toBe(0.5);
    });

    it("defaults to 0 delay when no argument given", () => {
      const anim = fadeIn();
      expect((anim.visible as any).transition?.delay).toBe(0);
    });
  });

  describe("slideIn", () => {
    it("returns hidden and visible states", () => {
      const anim = slideIn("left");
      expect(anim.hidden).toBeDefined();
      expect(anim.visible).toBeDefined();
    });

    it("slides from left (negative x in hidden)", () => {
      const anim = slideIn("left");
      expect((anim.hidden as any).x).toBeLessThan(0);
    });

    it("slides from right (positive x in hidden)", () => {
      const anim = slideIn("right");
      expect((anim.hidden as any).x).toBeGreaterThan(0);
    });

    it("slides from up (positive y in hidden)", () => {
      const anim = slideIn("up");
      expect((anim.hidden as any).y).toBeGreaterThan(0);
    });

    it("slides from down (negative y in hidden)", () => {
      const anim = slideIn("down");
      expect((anim.hidden as any).y).toBeLessThan(0);
    });

    it("visible state resets x and y to 0", () => {
      const anim = slideIn("left", 0.2);
      expect((anim.visible as any).x).toBe(0);
      expect((anim.visible as any).y).toBe(0);
    });

    it("respects delay parameter", () => {
      const anim = slideIn("left", 0.3);
      expect((anim.visible as any).transition?.delay).toBe(0.3);
    });

    it("defaults to left direction when no argument given", () => {
      const anim = slideIn();
      expect((anim.hidden as any).x).toBeLessThan(0);
    });
  });

  describe("staggerContainer", () => {
    it("is a defined function", () => {
      expect(typeof staggerContainer).toBe("function");
    });

    it("returns hidden and visible states", () => {
      const container = staggerContainer();
      expect(container.hidden).toBeDefined();
      expect(container.visible).toBeDefined();
    });

    it("respects custom staggerChildren value", () => {
      const container = staggerContainer(0.2);
      expect((container.visible as any).transition?.staggerChildren).toBe(0.2);
    });
  });
});
