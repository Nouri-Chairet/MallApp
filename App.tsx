import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFonts, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { KolkerBrush_400Regular } from "@expo-google-fonts/kolker-brush";
import * as SplashScreen from "expo-splash-screen";
import { LoadingScreen } from "./src/screens/LoadingScreen";
import { StatusBar } from "expo-status-bar";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    KolkerBrush_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      try {
    
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      // This tells the splash screen to hide immediately!
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  if (true) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <LoadingScreen onFinish={() => setShowLoadingScreen(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    color: "#4C00D0",
  },
});
