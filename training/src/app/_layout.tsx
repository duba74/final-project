import SessionProvider from "@/contexts/AuthContext";
import { Slot } from "expo-router";

export default function Root() {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    );
}
