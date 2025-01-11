import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function useSession() {
    const value = useContext(AuthContext);

    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error(
                "useSession must be wrapped in a <SessionProvider />"
            );
        }
    }

    return value;
}
