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
  return <FontAwesome size={32} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: route.name === "Add" ? false : true,
        tabBarActiveTintColor: THEME[colorScheme].secondary,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          height: 58,
          elevation: 3,
          backgroundColor: THEME[colorScheme].primary,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
        },
      })}
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
          tabBarShowLabel: false,
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <View className="justify-center items-center h-16 w-16 rounded-full bg-secondary">
              <CirclePlus className="text-primary" size={46} />
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
