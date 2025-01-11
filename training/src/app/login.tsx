import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const Login = () => {
    const { login } = useSession();
    const router = useRouter();

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text
                onPress={() => {
                    login();
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is
                    // successful before navigating.
                    router.replace("/");
                }}
            >
                Sign In
            </Text>
        </View>
    );
};
