import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "JV Recipes",
  slug: "jvrecipes",
  scheme: "jvrecipes",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/logo_light.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/logo_light.png",
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
      foregroundImage: "./assets/logo_light.png",
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
  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "./node_modules/jv-recipes/shared/assets/fonts/Montserrat-Black.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-Bold.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-ExtraBold.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-ExtraLight.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-Light.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-Medium.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-Regular.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-SemiBold.ttf",
          "./node_modules/jv-recipes/shared/assets/Montserrat-Thin.ttf",
        ],
      },
    ],
  ],
});
