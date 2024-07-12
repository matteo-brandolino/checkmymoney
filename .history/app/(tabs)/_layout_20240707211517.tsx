import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { THEME } from "@/constants/Colors";
import { View } from "react-native";
import { HomeIcon, CirclePlus } from "@/components/Icons";

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
      sceneContainerStyle={{ backgroundColor: THEME[colorScheme].background }}
      screenOptions={{
        tabBarActiveTintColor: THEME[colorScheme].background,
        tabBarInactiveTintColor: THEME[colorScheme].accent,
        headerStyle: { backgroundColor: THEME[colorScheme].background },
        headerShown: true,
        tabBarStyle: {
          height: 58,
          backgroundColor: THEME[colorScheme].primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <TabBarIcon name="home" color={color} />
            ) : (
              <HomeIcon color={color} size={44} />
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
          tabBarIcon: ({ focused }) => {
            return (
              <View className="justify-center items-center h-14 w-14 rounded-full bg-primary">
                <CirclePlus className="text-background" size={44} />
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
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
