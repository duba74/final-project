import { useEffect, useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
    return useReducer(
        (
            state: [boolean, T | null],
            action: T | null = null
        ): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

export const setStorageItemAsync = async (
    key: string,
    value: string | null
) => {
    try {
        if (value === null) {
            await AsyncStorage.removeItem(key);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    } catch (e) {
        console.error("AsyncStorage is unavailable:", e);
    }
};

export const useStorageState = (key: string): UseStateHook<string> => {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {
        AsyncStorage.getItem(key).then((value) => {
            setState(value);
        });
    }, [key]);

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

    return [state, setValue];
};
