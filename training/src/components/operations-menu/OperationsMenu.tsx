import TrainingModulePicker from "@/components/operations-menu/TrainingModulePicker";
import { logRecords } from "@/database/db-utils";
import sync from "@/database/sync";
import secondaryDataPull from "@/database/secondary-data-pull";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import ThemedButton from "../themed/ThemedButton";
import { useTranslation } from "react-i18next";
import ThemedText from "../themed/ThemedText";
import { useState } from "react";

const OperationsMenu = () => {
    const { t } = useTranslation();
    const { logout, session } = useSession();
    const { currentModule } = useCurrentModule();
    const [isSyncing, setIsSyncing] = useState(false);
    // const [isSyncing, setIsSyncing] = useState(true);

    const handleFullSync = async () => {
        setIsSyncing(true);

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                await sync(token);
                await secondaryDataPull(token);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        } else {
            console.error("No session available");
        }

        setIsSyncing(false);
    };

    const getUserData = (property: string) => {
        if (session) {
            return JSON.parse(session).user[property];
        }
    };

    return (
        <View style={styles.container} testID="planner-home">
            <View style={styles.mainContent}>
                {session && (
                    <ThemedText type="subtitle">{`${getUserData(
                        "first_name"
                    )} ${getUserData("last_name")}`}</ThemedText>
                )}
                <View style={styles.moduleSelectorContainer}>
                    <ThemedText type="defaultSemiBold">
                        {t("operations.trainingModulePickerLabel")}
                    </ThemedText>
                    <TrainingModulePicker currentModule={currentModule} />
                </View>
                <ThemedButton
                    style={styles.operationsButton}
                    title={t("operations.syncButtonText")}
                    onPress={handleFullSync}
                />
                <ThemedButton
                    style={styles.operationsButton}
                    title={t("operations.logoutButtonText")}
                    onPress={logout}
                />
            </View>
            <View style={styles.syncIndicatorContainer}>
                {isSyncing && <ActivityIndicator size="large" />}
                {isSyncing && (
                    <ThemedText>
                        {t("operations.syncInProgressMessage")}
                    </ThemedText>
                )}
            </View>
        </View>
    );
};

export default OperationsMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    mainContent: {
        flex: 5,
        gap: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    syncIndicatorContainer: {
        flex: 1,
        alignItems: "center",
    },
    moduleSelectorContainer: {
        alignItems: "center",
        gap: 8,
        width: 300,
    },
    operationsButton: {
        width: 160,
    },
});

// const handleSync = async () => {
//     if (session) {
//         try {
//             const parsedSession = JSON.parse(session);
//             const token = parsedSession.token;

//             await sync(token);
//         } catch (error) {
//             console.error(`Failed to parse session: ${error}`);
//         }
//     } else {
//         console.error("No session available");
//     }
// };

// const handleSecondaryDataPull = async () => {
//     if (session) {
//         try {
//             const parsedSession = JSON.parse(session);
//             const token = parsedSession.token;

//             await secondaryDataPull(token);
//         } catch (error) {
//             console.error(`Failed to parse session: ${error}`);
//         }
//     } else {
//         console.error("No session available");
//     }
// };

// <Button title="Sync" onPress={handleSync} />
// <Button
//     title="Secondary Data Pull"
//     onPress={handleSecondaryDataPull}
// />
// <Button
//     title="Log Villages"
//     onPress={() => logRecords("village")}
// />
// <Button
//     title="Log Training Modules"
//     onPress={() => logRecords("trainingModule")}
// />
// <Button
//     title="Log Current Training Module"
//     onPress={() => console.log(currentModule)}
// />
// <Button title="Log Clients" onPress={() => logRecords("client")} />
// <Button
//     title="Log Training Events"
//     onPress={() => logRecords("trainingEvent")}
// />
// <Button
//     title="Log Assignments"
//     onPress={() => logRecords("assignment")}
// />
// <Button
//     title="Log Training Events"
//     onPress={() => logRecords("trainingEvent")}
// />
