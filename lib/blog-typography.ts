import plugin from "tailwindcss/plugin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blogTypography = plugin(function ({ addComponents, theme }: { addComponents: any; theme: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addComponents({
    ".blog-content": {
      // Headings
      "h2, h3, h4": {
        "color": "hsl(var(--foreground))",
        "font-weight": "600",
        "scroll-margin-top": "100px",
        "&:hover": {
          "& .anchor": {
            "opacity": "1",
          },
        },
      },
      "h2": {
        "font-size": "2.25rem",
        "line-height": "2.5rem",
        "margin-top": "2.5rem",
        "margin-bottom": "1.5rem",
      },
      "h3": {
        "font-size": "1.875rem",
        "line-height": "2.25rem",
        "margin-top": "2rem",
        "margin-bottom": "1rem",
      },
      "h4": {
        "font-size": "1.5rem",
        "line-height": "2rem",
        "margin-top": "1.5rem",
        "margin-bottom": "0.75rem",
      },

      // Paragraphs and Lists
      "p": {
        "margin-bottom": "1.5rem",
        "line-height": "1.8",
        "color": "hsl(var(--foreground) / 0.9)",
      },
      "ul, ol": {
        "margin-bottom": "1.5rem",
        "padding-left": "1.5rem",
      },
      "li": {
        "margin-bottom": "0.5rem",
        "line-height": "1.8",
        "color": "hsl(var(--foreground) / 0.9)",
      },

      // Code Blocks
      "pre": {
        "background": "hsl(var(--card))",
        "border": "1px solid hsl(var(--border))",
        "border-radius": theme("borderRadius.lg"),
        "padding": "1.25rem",
        "margin": "1.5rem 0",
        "overflow-x": "auto",
      },
      "code": {
        "font-family": theme("fontFamily.mono"),
        "font-size": "0.875rem",
        "line-height": "1.5",
      },
      "p > code": {
        "background": "hsl(var(--accent))",
        "padding": "0.2rem 0.4rem",
        "border-radius": theme("borderRadius.sm"),
        "font-size": "0.875rem",
      },

      // Blockquotes
      "blockquote": {
        "border-left": "4px solid hsl(var(--border))",
        "padding-left": "1rem",
        "margin": "1.5rem 0",
        "font-style": "italic",
        "color": "hsl(var(--muted-foreground))",
      },

      // Links
      "a": {
        "color": "hsl(var(--primary))",
        "text-decoration": "none",
        "&:hover": {
          "text-decoration": "underline",
        },
      },

      // Images
      "img": {
        "border-radius": theme("borderRadius.lg"),
        "margin": "2rem 0",
      },

      // Tables
      "table": {
        "width": "100%",
        "border-collapse": "collapse",
        "margin": "2rem 0",
      },
      "th, td": {
        "border": "1px solid hsl(var(--border))",
        "padding": "0.75rem",
        "text-align": "left",
      },
      "th": {
        "background": "hsl(var(--accent))",
        "font-weight": "600",
      },

      // Callouts
      ".callout": {
        "border-radius": theme("borderRadius.lg"),
        "padding": "1.25rem",
        "margin": "1.5rem 0",
        "border-left": "4px solid",
        "&.info": {
          "background": "hsl(var(--info) / 0.1)",
          "border-color": "hsl(var(--info))",
        },
        "&.warning": {
          "background": "hsl(var(--warning) / 0.1)",
          "border-color": "hsl(var(--warning))",
        },
        "&.error": {
          "background": "hsl(var(--error) / 0.1)",
          "border-color": "hsl(var(--error))",
        },
      },
    },
  });
});

export default blogTypography;