/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: "#11181c",
        buttonText: "#ecedee",
        placeholderText: "#2a3c46",
        background: "#fff",
        buttonBackground: "#151718",
        pressedButtonBackground: "#373c3f",
        border: "#11181c",
        tint: tintColorLight,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#ecedee",
        buttonText: "#11181c",
        placeholderText: "#93999f",
        background: "#151718",
        buttonBackground: "#fff",
        pressedButtonBackground: "#c7c7c7",
        border: "#ecedee",
        tint: tintColorDark,
        icon: "#9ba1a6",
        tabIconDefault: "#9ba1a6",
        tabIconSelected: tintColorDark,
    },
};
