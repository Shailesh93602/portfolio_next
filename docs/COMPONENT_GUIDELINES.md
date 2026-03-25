# Component Guidelines

This document outlines the standards and best practices for creating and maintaining React components in this portfolio website.

## 📁 Directory Structure

All components should be placed in the unified `src/components` directory following this structure:

```bash
src/
└── components/
    ├── ui/              # Reusable UI components
    ├── layout/          # Layout components (headers, footers, etc.)
    ├── hooks/           # Custom React hooks
    ├── theme/           # Theme-related components
    └── utils/           # Component utilities and types
```

## 🧱 Component Creation

### Basic Component Structure

```tsx
// Button.tsx
import React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
}: ButtonProps) {
  const baseStyles = "rounded font-medium transition-colors";

  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
}
```

## ✅ Best Practices

1. **Props:**
   - Use TypeScript interfaces for prop types
   - Provide sensible defaults
   - Limit prop complexity (flatten objects when needed)

2. **Styling:**
   - Use Tailwind CSS for styling
   - Follow BEM naming convention when needed
   - Separate complex conditional classes into constants

3. **Responsiveness:**
   - Build mobile-first components
   - Use Tailwind's responsive modifiers
   - Test components at different screen sizes

4. **Reusability:**
   - Keep components focused (SRP)
   - Favor composition over inheritance
   - Document component usage with examples

5. **Performance:**
   - Use React.memo for optimization when needed
   - Avoid unnecessary re-renders
   - Use Suspense for async content

## 📝 Documentation

All components should include:

- A clear doc comment with purpose and usage
- Prop type definitions with descriptions
- Example usage (when not obvious)
- Best practices or related components

## 🧪 Testing

All components should be tested with:

- Basic rendering tests
- Input variation tests (props, states)
- Interaction tests (when applicable)
- Accessibility checks

## 🔄 Versioning

Use version numbers for components when:

- Creating public component libraries
- Making breaking changes
- Creating versioned documentation
