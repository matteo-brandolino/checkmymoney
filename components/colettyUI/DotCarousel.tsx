import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";

import { ExpandingDot } from "react-native-animated-pagination-dots";
import { THEME } from "@/Colors";
import { useColorScheme } from "../useColorScheme";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function DotCarousel({
  children,
  length,
}: {
  children: JSX.Element[];
  length: number;
}) {
  const width = Dimensions.get("window").width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, length * width],
  });

  const { colorScheme } = useColorScheme();

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <SafeAreaView testID="safe-area-view" style={styles.flex}>
      <AnimatedPagerView
        testID="pager-view"
        initialPage={0}
        ref={ref}
        style={styles.PagerView}
        onPageScroll={onPageScroll}
      >
        {children}
      </AnimatedPagerView>
      <View>
        <ExpandingDot
          testID={"expanding-dot"}
          data={[...Array(length).keys()]}
          expandingDotWidth={30}
          //@ts-ignore
          scrollX={scrollX}
          inActiveDotOpacity={0.6}
          dotStyle={{
            width: 10,
            height: 10,
            backgroundColor: THEME[colorScheme].primary,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          containerStyle={{
            bottom: 50,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  PagerView: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#63a4ff",
  },
  progressContainer: { flex: 0.1, backgroundColor: "#63a4ff" },
  center: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
  },
});
