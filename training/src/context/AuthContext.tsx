import { useStorageState } from "@/hooks/useStorageState";
import { createContext, type PropsWithChildren } from "react";

export const AuthContext = createContext<{
    login: () => void;
    logout: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    login: () => null,
    logout: () => null,
    session: null,
    isLoading: false,
});

const SessionProvider = ({ children }: PropsWithChildren) => {
    const [[isLoading, session], setSession] = useStorageState("session");

    return (
        <AuthContext.Provider
            value={{
                login: () => {
                    // Perform sign-in logic here
                    setSession("xxx");
                },
                logout: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default SessionProvider;
