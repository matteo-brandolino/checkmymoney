const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};
export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(214.3 31.8% 91.4%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(221.2 83.2% 53.3%)", // primary
    text: "hsl(222.2 84% 4.9%)", // foreground
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(222.2 84% 4.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};
