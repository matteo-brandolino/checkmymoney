import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRightIcon } from "@/components/Icons";
import { THEME } from "@/constants/Colors";
import { H4 } from "@/components/ui/typography";
import { useColorScheme } from "@/components/useColorScheme";

export default function Settings() {
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const settingsRoutes = [
    {
      label: "Create a new template",
      value: "newTemplate",
    },
    {
      label: "Import a file",
      value: "importFile",
    },
  ];
  const goToNewTemplate = (route: string) => {
    router.push(route);
  };

  return (
    <View style={{ paddingTop: insets.top * 2 }} className="flex-1">
      {settingsRoutes &&
        settingsRoutes.map((settingRoute, idx) => (
          <TouchableOpacity
            key={idx}
            className="flex-row justify-between items-center px-5"
            onPress={() => goToNewTemplate(settingRoute.value)}
          >
            <H4 className="font-normal">{settingRoute.label}</H4>
            <ArrowRightIcon color={THEME[colorScheme].primary} size={20} />
          </TouchableOpacity>
        ))}
    </View>
  );
}
