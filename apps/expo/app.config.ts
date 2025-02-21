import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "JV Recipes",
  slug: "jvrecipes",
  scheme: "jvrecipes",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./src/assets/images/logo_light.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/logo_light.png",
    resizeMode: "contain",
    backgroundColor: "#a90d3b",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  jsEngine: "hermes",
  ios: {
    bundleIdentifier: "com.jdvivian.jvrecipes",
    supportsTablet: true,
  },
  android: {
    package: "com.jdvivian.jvrecipes",
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/logo_light.png",
      backgroundColor: "#A90D3B",
    },
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router"],
});
