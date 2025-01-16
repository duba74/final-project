import Auth from "@/app/auth";
import { Platform } from "react-native";
import {
    TimeoutError,
    NetworkError,
    AuthenticationError,
    ServerError,
} from "@/errors/errors";

export const login = async (username: string, password: string) => {
    const credentials = {
        username: username,
        password: password,
    };

    console.log(credentials);
    console.log(JSON.stringify(credentials));

    const host =
        Platform.OS === "web"
            ? "http://127.0.0.1:8000"
            : "https://fa04-41-216-53-63.ngrok-free.app";
    const endpoint = "/api/login/";
    const url = host + endpoint;

    try {
        const timeout = new Promise((resolve, reject) =>
            setTimeout(
                () => reject(new TimeoutError("Request timed out")),
                10000
            )
        );
        const fetchPromise = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }).catch((error) => {
            throw new NetworkError("Network error");
        });

        const response = (await Promise.race([
            fetchPromise,
            timeout,
        ])) as Response;

        if (!response.ok) {
            if (response.status >= 500) {
                throw new ServerError("Server error");
            } else if (response.status === 401) {
                throw new AuthenticationError("Invalid credentials");
            } else {
                throw new Error("Some unexpected error occurred");
            }
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        if (
            error instanceof TimeoutError ||
            error instanceof AuthenticationError ||
            error instanceof NetworkError ||
            error instanceof ServerError
        ) {
            console.error(`${error.name}: ${error.message}`);

            throw error;
        } else {
            console.error("Some unexpected error occurred");
            throw new Error();
        }
    }
};
