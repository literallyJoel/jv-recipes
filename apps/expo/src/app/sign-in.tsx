import { Button, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import SText from "~/components/styledDefaults/SText";
import { useSignIn, useSignOut, useUser } from "~/utils/auth";
import logoLight from "../assets/images/logo_light.png";

function AuthButton() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <>
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? "Sign Out" : "Sign In With Google"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function SignIn() {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen />
      <View className="flex h-full w-full flex-col items-center gap-3 bg-background p-6">
        <Image
          source={logoLight}
          style={{ width: 150, height: 150 }}
          className="border-redlight rounded-full border-2"
        />

        <SText className="pb-2 text-center text-4xl text-foreground">
          Recipes
        </SText>

        <Text
          style={{ fontFamily: "MontserratSemiold", fontWeight: "bold" }}
          className="text-foreground"
        >
          Recipes
        </Text>
        <AuthButton />
      </View>
    </SafeAreaView>
  );
}
