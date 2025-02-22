import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "JV Recipes",
  slug: "jvrecipes",
  scheme: "jvrecipes",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./node_modules/@jv-recipes/shared/assets/images/logos/logo_light.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./node_modules/@jv-recipes/shared/assets/images/logos/logo_light.png",
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
      foregroundImage:
        "./node_modules/@jv-recipes/shared/assets/images/logos/logo_light.png",
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
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Black.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Bold.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-ExtraBold.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-ExtraLight.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Light.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Medium.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Regular.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-SemiBold.ttf",
          "./node_modules/@jv-recipes/shared/assets/fonts/Montserrat-Thin.ttf",
        ],
      },
    ],
  ],
});
