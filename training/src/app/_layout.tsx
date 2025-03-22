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
    StackActions,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "i18n";
import TrainingModuleProvider from "@/context/TrainingModuleContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

SplashScreen.preventAutoHideAsync();

type RootLayoutProps = {
    lightColor: string;
    darkColor: string;
};

const Root = ({ lightColor, darkColor }: RootLayoutProps) => {
    const colorScheme = useColorScheme();
    const [loaded, error] = useFonts({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    });
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );

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
                    <TrainingModuleProvider>
                        <SafeAreaProvider>
                            <SafeAreaView style={{ flex: 1 }}>
                                <StatusBar
                                    barStyle={
                                        colorScheme === "dark"
                                            ? "light-content"
                                            : "dark-content"
                                    }
                                    backgroundColor={backgroundColor}
                                />

                                <Slot />
                            </SafeAreaView>
                        </SafeAreaProvider>
                    </TrainingModuleProvider>
                </I18nextProvider>
            </SessionProvider>
        </ThemeProvider>
    );
};

export default Root;
