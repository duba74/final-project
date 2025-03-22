/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const backgroundColorLight = "#fff";
const backgroundColorDark = "#151718";
const altBackroundColorDark = backgroundColorLight;
const altBackroundColorLight = backgroundColorDark;

const textColorLight = "#11181c";
const textColorDark = "#ecedee";
const altTextColorLight = textColorDark;
const altTextColorDark = textColorLight;

const tintColorLight0 = "#e7f8fe";
const tintColorLight1 = "#87dcf8";
const tintColorLight2 = "#0a7ea4";
const tintColorLight3 = "#0a81a8";

const tintColorDark = "#fff";

export const Colors = {
    light: {
        text: textColorLight,
        buttonText: altTextColorLight,
        buttonTextCancel: textColorLight,
        buttonTextDanger: backgroundColorLight,
        placeholderText: "#2a3c46",
        background: "#fff",
        buttonBackground: altBackroundColorLight,
        buttonBackgroundCancel: "#fff",
        buttonBackgroundDanger: "#a10500",
        pressedButtonBackground: "#373c3f",
        pressedButtonBackgroundCancel: "#e2e4e5",
        pressedButtonBackgroundDanger: "#ed0700",
        border: textColorLight,
        tint: tintColorLight2,
        icon: "#687076",
        tabIconDefault: textColorLight,
        tabIconSelected: altTextColorLight,
        tabBoxColor: altBackroundColorLight,
        textInputBackground: "#e8eaeb",
        villageListItemBackground: tintColorLight0,
        trainingEventListItemBackground: tintColorLight0,
        shadowColor: "#000",
    },
    dark: {
        text: textColorDark,
        buttonText: altTextColorDark,
        buttonTextCancel: textColorDark,
        buttonTextDanger: "#fff",
        placeholderText: "#93999f",
        background: backgroundColorDark,
        buttonBackground: altBackroundColorDark,
        buttonBackgroundCancel: backgroundColorDark,
        buttonBackgroundDanger: "#a10500",
        pressedButtonBackground: "#c7c7c7",
        pressedButtonBackgroundCancel: "#373c3f",
        pressedButtonBackgroundDanger: "#ed0700",
        border: textColorDark,
        tint: tintColorDark,
        icon: "#9ba1a6",
        tabIconDefault: textColorDark,
        tabIconSelected: altTextColorDark,
        tabBoxColor: altBackroundColorDark,
        textInputBackground: "#2e3335",
        villageListItemBackground: "#242729",
        trainingEventListItemBackground: "#3c4144",
        shadowColor: "#fff",
    },
};
