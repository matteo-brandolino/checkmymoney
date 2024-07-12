import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { THEME } from "@/constants/Colors";
import { View } from "react-native";
import { CirclePlus } from "@/components/Icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -1 }} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME[colorScheme].secondary,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 27,
          left: 16,
          right: 16,
          height: 72,
          elevation: 0,
          backgroundColor: THEME[colorScheme].primary,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <View className="justify-center items-center h-12 w-12 rounded-[9999] bg-orange-900">
              <CirclePlus className="text-secondary" size={40} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "Create a new template",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
