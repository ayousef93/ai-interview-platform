import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      colors: {
        surface: "#07070f",
        panel:   "#0d0d1a",
        card:    "#111127",
        line:    "rgba(255,255,255,0.08)",
        "line-h":"rgba(255,255,255,0.14)"
      },
      boxShadow: {
        glow:        "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.5)",
        "glow-v":    "0 0 0 1px rgba(124,58,237,0.30), 0 8px 32px rgba(124,58,237,0.18)",
        "glow-t":    "0 0 0 1px rgba(20,184,166,0.28), 0 8px 32px rgba(20,184,166,0.14)",
        "glow-i":    "0 0 0 1px rgba(79,70,229,0.28),  0 8px 32px rgba(79,70,229,0.14)",
        btn:         "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)"
      },
      keyframes: {
        "fade-up": { "0%":{ opacity:"0", transform:"translateY(14px)" }, "100%":{ opacity:"1", transform:"translateY(0)" } },
        "fade-in": { "0%":{ opacity:"0" }, "100%":{ opacity:"1" } },
        float:     { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-5px)" } },
        pulse2:    { "0%,100%":{ opacity:"1" }, "50%":{ opacity:"0.4" } },
        spin:      { to:{ transform:"rotate(360deg)" } }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.35s ease both",
        float:     "float 3s ease-in-out infinite",
        pulse2:    "pulse2 2s ease infinite"
      }
    }
  },
  plugins: []
};

export default config;
