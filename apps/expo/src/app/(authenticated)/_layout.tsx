import "@bacons/text-decoder/install";

import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { TRPCProvider } from "~/utils/api";

import "../../styles.css";

import { useUser } from "~/utils/auth";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const user = useUser();

  if (!user) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          },
        }}
      />
      <StatusBar />
    </>
  );
}
