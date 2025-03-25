import ParticipantList from "@/components/event-details/ParticipantList";
import PlannerEventForm from "@/components/event-details/PlannerEventForm";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import TrainingModule from "@/database/data-model/models/TrainingModule";
import Village from "@/database/data-model/models/Village";
import {
    trainingEventCollection,
    trainingModuleCollection,
    villageCollection,
} from "@/database/database";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const TrainingEventFormModal = () => {
    const { villageId, currentModuleId, trainingEventId } =
        useLocalSearchParams<{
            villageId?: string;
            currentModuleId?: string;
            trainingEventId?: string;
        }>();
    const isEditing = !!trainingEventId;
    const [trainingEvent, setTrainingEvent] = useState<TrainingEvent | null>(
        null
    );
    const [village, setVillage] = useState<Village | null>(null);
    const [trainingModule, setTrainingModule] = useState<TrainingModule | null>(
        null
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditing) {
                    const trainingEventRecord =
                        await trainingEventCollection.find(trainingEventId);
                    const villageRecord = await trainingEventRecord.village;
                    const trainingModuleRecord =
                        await trainingEventRecord.trainingModule;

                    setTrainingEvent(trainingEventRecord);
                    setVillage(villageRecord);
                    setTrainingModule(trainingModuleRecord);
                } else if (villageId && currentModuleId) {
                    const villageRecord = await villageCollection.find(
                        villageId
                    );
                    const trainingModuleRecord =
                        await trainingModuleCollection.find(currentModuleId);

                    setVillage(villageRecord);
                    setTrainingModule(trainingModuleRecord);
                }
            } catch (error) {
                console.error(`Error fetching records from DB: ${error}`);
            }
        };
        fetchData();
    }, [isEditing, trainingEventId, villageId, currentModuleId]);

    if (village && trainingModule) {
        return (
            <View>
                {isEditing ? (
                    <>
                        <PlannerEventForm
                            village={village}
                            trainingModule={trainingModule}
                            trainingEvent={trainingEvent}
                        />
                        <ParticipantList trainingEvent={trainingEvent} />
                    </>
                ) : (
                    <PlannerEventForm
                        village={village}
                        trainingModule={trainingModule}
                        trainingEvent={trainingEvent}
                    />
                )}
            </View>
        );
    }

    return (
        <ThemedView>
            <ThemedText>Loading data...</ThemedText>
        </ThemedView>
    );
};

export default TrainingEventFormModal;
