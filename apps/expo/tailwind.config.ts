import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@jv-recipes/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      fontFamily: {
        "montserrat-thin": ["Montserrat-Thin"],
        "montserrat-light": ["Montserrat-Light"],
        montserrat: ["Montserrat-Regular"],
        "montserrat-medium": ["Montserrat-Medium"],
        "montserrat-semibold": ["Montserrat-SemiBold"],
        "montserrat-bold": ["Montserrat-Bold"],
        "montserrat-extrabold": ["Montserrat-ExtraBold"],
        "montserrat-black": ["Montserrat-Black"],
      },
    },
  },
} satisfies Config;
