import { useSession } from "@/hooks/useSession";
import { Button, Text, View } from "react-native";

export default function Index() {
    const { logout } = useSession();
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Button title="Logout" onPress={logout} />
        </View>
    );
}
