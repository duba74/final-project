import { useStorageState } from "@/hooks/useStorageState";
import { createContext, type PropsWithChildren } from "react";
import * as AuthService from "@/services/AuthService";

export const AuthContext = createContext<{
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    login: async () => false,
    logout: () => null,
    session: null,
    isLoading: false,
});

const SessionProvider = ({ children }: PropsWithChildren) => {
    const [[isLoading, session], setSession] = useStorageState("session");

    const login = async (
        username: string,
        password: string
    ): Promise<boolean> => {
        try {
            const result = await AuthService.login(username, password);
            const { token, user } = result;
            setSession(JSON.stringify({ token, user }));

            return true;
        } catch (error) {
            console.log(`Login failed: ${error}`);

            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                logout: () => setSession(null),
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default SessionProvider;
