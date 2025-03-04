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
    };

    useEffect(() => {
        if (session) {
            try {
                const user = JSON.parse(session).user;

                if (user.role === "trainer") {
                    router.replace("/(app)/trainer/villages");
                } else if (user.role === "planner") {
                    router.replace("/(app)/planner/villages");
                } else if (user.role === "admin") {
                    router.replace("/(app)/admin/home");
                } else {
                    router.replace("/(app)/norole/home");
                }
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
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
