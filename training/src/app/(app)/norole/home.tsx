import { useSession } from "@/hooks/useSession";
import { useTranslation } from "react-i18next";
import { Button, View, Text } from "react-native";

const NoRoleHome = () => {
    const { t } = useTranslation();
    const { logout } = useSession();

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

export default NoRoleHome;
