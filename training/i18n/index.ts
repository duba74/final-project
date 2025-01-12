// Adapted from here:
// https://dev.to/lucasferreiralimax/i18n-in-react-native-with-expo-2j0j

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationEn from "./locales/en/translation.json";
import translationFr from "./locales/fr/translation.json";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const resources = {
    en: { translation: translationEn },
    fr: { translation: translationFr },
};

const initI18n = async () => {
    // Not able to use the useStorageState hook out here
    let savedLanguage;
    if (Platform.OS == "web") {
        savedLanguage = await AsyncStorage.getItem("language");
        if (!savedLanguage) {
            const deviceLanguage = Localization.getLocales()[0].languageCode;
            if (deviceLanguage)
                await AsyncStorage.setItem("language", deviceLanguage);
        }
    } else {
        savedLanguage = await SecureStore.getItemAsync("language");
        if (!savedLanguage) {
            const deviceLanguage = Localization.getLocales()[0].languageCode;
            if (deviceLanguage)
                await SecureStore.setItemAsync("language", deviceLanguage);
        }
    }

    i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage ? savedLanguage : "",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
