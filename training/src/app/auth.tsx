import Login from "@/components/login/Login";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import secondaryDataPull from "@/database/secondary-data-pull";
import sync from "@/database/sync";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Auth = () => {
    const { t } = useTranslation();
    const { login, session } = useSession();
    const router = useRouter();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    // const [isAuthenticating, setIsAuthenticating] = useState(true);
    // const [isSyncing, setIsSyncing] = useState(true);

    const handleLogin = async (username: string, password: string) => {
        setIsAuthenticating(true);
        const isAuthenticated = await login(username, password);
        setIsAuthenticating(false);
    };

    useEffect(() => {
        const syncAndRedirect = async () => {
            setIsSyncing(true);
            if (session) {
                try {
                    const user = JSON.parse(session).user;
                    const token = JSON.parse(session).token;

                    await secondaryDataPull(token);
                    await sync(token);

                    if (user.role === "trainer") {
                        router.replace("/(app)/trainer/villages");
                    } else if (user.role === "planner") {
                        router.replace("/(app)/planner/villages");
                    } else {
                        router.replace("/(app)/norole/home");
                    }
                } catch (error) {
                    console.error(`Failed to parse session: ${error}`);
                } finally {
                }
            }
            setIsSyncing(false);
        };

        syncAndRedirect();
    }, [session, router]);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.mainContent}>
                <Login onLogin={handleLogin} />
            </View>
            <View style={styles.statusIndicatorContent}>
                {(isAuthenticating || isSyncing) && (
                    <ActivityIndicator size="large" />
                )}
                {isAuthenticating && (
                    <ThemedText>{t("login.authenticatingMessage")}</ThemedText>
                )}
                {isSyncing && (
                    <ThemedText>{t("login.syncInProgressMessage")}</ThemedText>
                )}
            </View>
        </ThemedView>
    );
};

export default Auth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    mainContent: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
    },
    statusIndicatorContent: {
        flex: 1,
        alignItems: "center",
    },
});
