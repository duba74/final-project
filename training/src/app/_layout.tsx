import SessionProvider from "@/context/AuthContext";
import { Slot } from "expo-router";

export default function Root() {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    );
}
