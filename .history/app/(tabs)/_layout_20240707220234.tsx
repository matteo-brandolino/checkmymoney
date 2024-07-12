import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { THEME } from "@/constants/Colors";
import { View } from "react-native";
import {
  DoorOpenIcon,
  CirclePlus,
  DoorClosedIcon,
  PackageOpenIcon,
  PackageIcon,
} from "@/components/Icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={32} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Tabs
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
        name="new"
        options={{
          title: "TEMPLATE",
          headerTitle: "Create a new Template",
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
