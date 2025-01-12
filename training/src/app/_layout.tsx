// import "i18n";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import SessionProvider from "@/context/AuthContext";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "i18n";

SplashScreen.preventAutoHideAsync();

export default function Root() {
    const colorScheme = useColorScheme();
    const [loaded, error] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <SessionProvider>
                <I18nextProvider i18n={i18n}>
                    <Slot />
                </I18nextProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
