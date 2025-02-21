import { Text } from "react-native";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";

const SText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const [loaded, error] = useFonts({
    Regular: Montserrat_400Regular,
    Medium: Montserrat_500Medium,

    SemiBold: Montserrat_600SemiBold,
    Bold: Montserrat_700Bold,
  });

  if (!loaded || error) {
    return <Text className={className}>{children}</Text>;
  }
  return (
    <Text style={{ fontFamily: "Bold" }} className={className}>
      {children}
    </Text>
  );
};

export default SText;
