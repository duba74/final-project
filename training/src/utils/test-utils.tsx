// The code in this file is modified from the example from the docs for React Testing Library (https://testing-library.com/docs/react-testing-library/setup/#custom-render)

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import SessionProvider from "@/context/AuthContext";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "i18n";
import { I18nextProvider } from "react-i18next";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <SessionProvider>
                <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
            </SessionProvider>
        </ThemeProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };
