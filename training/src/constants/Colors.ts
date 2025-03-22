/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight3 = "#0a81a8";
const tintColorLight2 = "#0a7ea4";
const tintColorLight1 = "#87dcf8";
const tintColorLight0 = "#e7f8fe";
const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: "#11181c",
        buttonText: "#ecedee",
        buttonTextCancel: "#11181c",
        buttonTextDanger: "#fff",
        placeholderText: "#2a3c46",
        background: "#fff",
        buttonBackground: "#151718",
        buttonBackgroundCancel: "#fff",
        buttonBackgroundDanger: "#a10500",
        pressedButtonBackground: "#373c3f",
        pressedButtonBackgroundCancel: "#e2e4e5",
        pressedButtonBackgroundDanger: "#ed0700",
        border: "#11181c",
        tint: tintColorLight2,
        icon: "#687076",
        tabIconDefault: "#687076",
        tabIconSelected: tintColorLight3,
        textInputBackground: "#e8eaeb",
        villageListItemBackground: tintColorLight1,
        trainingEventListItemBackground: tintColorLight0,
        shadowColor: "#000",
    },
    dark: {
        text: "#ecedee",
        buttonText: "#11181c",
        buttonTextCancel: "#ecedee",
        buttonTextDanger: "#fff",
        placeholderText: "#93999f",
        background: "#151718",
        buttonBackground: "#fff",
        buttonBackgroundCancel: "#151718",
        buttonBackgroundDanger: "#a10500",
        pressedButtonBackground: "#c7c7c7",
        pressedButtonBackgroundCancel: "#373c3f",
        pressedButtonBackgroundDanger: "#ed0700",
        border: "#ecedee",
        tint: tintColorDark,
        icon: "#9ba1a6",
        tabIconDefault: "#9ba1a6",
        tabIconSelected: "#27c0f2",
        textInputBackground: "#2e3335",
        villageListItemBackground: "#242729",
        trainingEventListItemBackground: "#3c4144",
        shadowColor: "#fff",
    },
};
