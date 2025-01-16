import Login from "@/components/login/Login";
import ThemedView from "@/components/themed/ThemedView";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

const Auth = () => {
    const { login, session } = useSession();
    const router = useRouter();

    const handleLogin = async (username: string, password: string) => {
        const isAuthenticated = await login(username, password);
        console.log("isAuthenticated: " + isAuthenticated);
    };

    useEffect(() => {
        if (session) {
            const user = JSON.parse(session);
            console.log(user);

            router.replace("/");
        }
    }, [session, router]);

    return (
        <ThemedView style={styles.container}>
            <Login onLogin={handleLogin} />
        </ThemedView>
    );
};

export default Auth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
