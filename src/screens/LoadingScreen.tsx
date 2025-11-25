import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  interpolateColor,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Logo } from "../components/Logo";
interface LoadingScreenProps {
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withSequence(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), // Phase 1: Big Of appears
      withDelay(
        500,
        withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ) 
    );

    // Call onFinish after animation
    const timeout = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4500);

    return () => clearTimeout(timeout);
  }, []);

  

  const ofStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.2, 1, 2],
      [0, 1, 1, 1]
    );
    const rotation = interpolate(
      animationProgress.value,
      [0,1, 2],
      [90, 10, 0]
    );
    const scale = interpolate(animationProgress.value, [3, 1, 2], [0.5, 5, 1]);
    const translateX = interpolate(
      animationProgress.value,
      [0, 1, 2],
      [0, 0, -140]
    );
    const translateY = interpolate(
      animationProgress.value,
      [0, 1, 2],
      [0, 30, 32]
    );
    const color = interpolateColor(
      animationProgress.value,
      [0, 1, 2],
      ["#1d124e", "#3001FF", "#FFFFFF"]
    );

    return {
      opacity,
      color,
      transform: [{ rotate: `${rotation}deg` },{ scale }, { translateX }, { translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer]}>
        <Logo  color="#1B0D5B" />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.mallText]}>
          Mall
        </Text>
        <Animated.Text style={[styles.text, styles.ofText, ofStyle]}>
          Of
        </Animated.Text>
        <Text style={[styles.text, styles.sousseText]}>
          Sousse
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C00D0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top:  150,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    position:"absolute"
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  mallText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 48,
    marginBottom: 10,
  },
  sousseText: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 48,
   
  },
  ofText: {
    fontFamily: "KolkerBrush_400Regular",
    fontSize: 64,
    position: "absolute",
  },
});
