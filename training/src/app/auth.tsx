import Login from "@/components/login/Login";
import ThemedView from "@/components/themed/ThemedView";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

const Auth = () => {
    const { login } = useSession();
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <Login />
            {/* <Button
                title="Login"
                onPress={() => {
                    login();
                    router.replace("/");
                }}
            /> */}
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
