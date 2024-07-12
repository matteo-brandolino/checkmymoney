import "../global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { Platform } from "react-native";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { db } from "../db/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { THEME } from "@/constants/Colors";

let {
  primary,
  background,
  card,
  foreground: text,
  border,
  destructive: notification,
} = THEME.light;
const LIGHT_THEME: Theme = {
  dark: false,
  colors: { primary, background, card, text, border, notification },
};

const {
  primary: primaryD,
  background: backgroundD,
  card: cardD,
  foreground: textD,
  border: borderD,
  destructive: notificationD,
} = THEME.dark;
const DARK_THEME: Theme = {
  dark: true,
  colors: {
    primary: primaryD,
    background: backgroundD,
    card: cardD,
    text: textD,
    border: borderD,
    notification: notificationD,
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [_, setIsColorSchemeLoaded] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  //Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!loaded) {
    return null;
  }
  //TODO hande migration versioning
  if (migrationError) {
    console.info(migrationError.message);
  }

  if (!success) {
    console.info("Migration in progress");
  }
  if (success) {
    console.info("Migration OK");
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isDarkColorScheme } = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
