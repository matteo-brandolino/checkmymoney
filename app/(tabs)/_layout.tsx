import { View } from "react-native";
import { Tabs } from "expo-router";
import { THEME } from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

import {
  DoorOpenIcon,
  CirclePlus,
  DoorClosedIcon,
  PackageOpenIcon,
  PackageIcon,
} from "@/components/Icons";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: THEME[colorScheme].background }}
      screenOptions={{
        tabBarActiveTintColor: THEME[colorScheme].background,
        tabBarInactiveTintColor: THEME[colorScheme].background,
        headerStyle: { backgroundColor: THEME[colorScheme].background },
        headerShown: true,
        tabBarStyle: {
          height: 58,
          backgroundColor: THEME[colorScheme].secondary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <DoorOpenIcon color={color} size={26} />
            ) : (
              <DoorClosedIcon color={color} size={26} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: () => {
            return null;
          },
          title: "ADD",
          headerShown: false,
          tabBarItemStyle: {
            marginBottom: 30,
          },
          tabBarIcon: ({ color }) => {
            return (
              <View className="justify-center items-center h-14 w-14 rounded-full bg-secondary">
                <CirclePlus color={color} size={44} />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "SETTINGS",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <PackageOpenIcon color={color} size={26} />
            ) : (
              <PackageIcon color={color} size={26} />
            );
          },
        }}
      />
    </Tabs>
  );
}
