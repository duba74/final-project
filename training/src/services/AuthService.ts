import { Platform } from "react-native";

export const login = async (username: string, password: string) => {
    const credentials = {
        username: username,
        password: password,
    };

    console.log(credentials);
    console.log(JSON.stringify(credentials));

    const host =
        Platform.OS === "web"
            ? "http://127.0.0.1:8000/api/login/"
            : "https://21af-197-234-221-194.ngrok-free.app";
    const endpoint = "/api/login/";
    const url = host + endpoint;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);

        return data;
    } else {
        throw new Error("Invalid credentials");
    }
};
