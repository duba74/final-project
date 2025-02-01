import secondarySync from "@/database/secondary-sync";
import { useSession } from "@/hooks/useSession";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";

const Index = () => {
    const { t } = useTranslation();
    const { logout, session } = useSession();

    const handleSecondarySync = () => {
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                secondarySync(token);
            } catch (error) {
                console.error("Failed to parse session:", error);
            }
        } else {
            console.error("No session available");
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>{t("noRoleHome.message")}</Text>
            <Text>{t("noRoleHome.instructions")}</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

export default Index;
