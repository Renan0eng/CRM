import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(233, 60%, 6%)",
          foreground: "hsl(218, 46%, 10%)",
          white: "hsl(222, 25%, 20%)",
          whatsapp: {
            user: "hsl(169, 100%, 18%)",
            from: "hsl(0, 0%, 21%)",
          },
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(218, 46%, 10%)",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(223, 100%, 50%)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "blue",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(223, 100%, 50%)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        text: {
          DEFAULT: "hsl(0, 0%, 95%)",
          foreground: "hsl(0, 0%, 65%)",
        },
        border: "hsl(var(--border))",
        input: "hsl(0, 0%, 21%)",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        table: {
          border: "hsl(231, 40%, 16%)",
        },
        sidebar: {
          DEFAULT: "hsl(218, 46%, 10%)",
          foreground: "hsl(0, 0%, 65%)",
          primary: "hsl(223, 100%, 50%)",
          "primary-foreground": "hsl(169, 100%, 33%)",
          accent: "hsl(224, 35%, 15%)",
          "accent-foreground": "hsl(0, 0%, 95%)",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        custom: "0px 0px 3px 0px rgba(0,0,0,0.17)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
