import TrainingModule from "@/database/data-model/models/TrainingModule";
import { trainingModuleCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import ThemedText from "../themed/ThemedText";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type TrainingModuleIndicatorProps = {
    trainingModuleId: string | null;
};

const TrainingModuleIndicator = ({
    trainingModuleId,
}: TrainingModuleIndicatorProps) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [trainingModule, setTrainingModule] = useState<
        TrainingModule | undefined
    >();

    useEffect(() => {
        const fetchData = async () => {
            if (!trainingModuleId) return;

            try {
                const trainingModuleRecord =
                    await trainingModuleCollection.find(trainingModuleId);
                setTrainingModule(trainingModuleRecord);
            } catch (error) {
                console.error(`Error fetching records from DB: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (trainingModule) {
        return (
            <ThemedText type="subtitle" style={styles.indicatorText}>
                {trainingModule.name}
            </ThemedText>
        );
    } else {
        <ThemedText type="subtitle" style={styles.indicatorText}>
            {t("trainingModuleIndicator.noModuleSelectedMessage")}
        </ThemedText>;
    }
};

export default TrainingModuleIndicator;

const styles = StyleSheet.create({
    indicatorText: {
        marginVertical: 10,
    },
});
