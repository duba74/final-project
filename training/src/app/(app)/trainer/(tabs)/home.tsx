import ThemedText from "@/components/themed/ThemedText";
import { logRecords } from "@/database/db-utils";
import secondarySync from "@/database/secondary-sync";
import { useSession } from "@/hooks/useSession";
import { Button, View } from "react-native";

const TrainerHome = () => {
    const { logout, session } = useSession();

    const handleSecondarySync = () => {
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                secondarySync(token);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        } else {
            console.error("No session available");
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            testID="trainer-home"
        >
            <ThemedText>Trainer Home</ThemedText>
        </View>
    );
};

export default TrainerHome;
