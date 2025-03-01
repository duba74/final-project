import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedView from "@/components/themed/ThemedView";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Village from "@/database/data-model/models/Village";
import { compose, withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View } from "react-native";
import { format } from "date-fns";
import { useSession } from "@/hooks/useSession";
import * as Location from "expo-location";
import { trainingEventCollection } from "@/database/database";
import { Relation } from "@nozbe/watermelondb";
import EventVillageDescription from "./EventVillageDescription";

type EventCompletionFormProps = {
    username: string;
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const EventCompletionForm = ({
    username,
    trainingEventId,
    trainingEvent,
}: EventCompletionFormProps) => {
    const { session } = useSession();
    const [commentText, setCommentText] = useState("");
    const [locPermErrorMsg, setLocPermErrorMsg] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    console.log("event-completion-form: " + trainingEventId);

    const handleToggleCompletionTime = () => {
        trainingEvent.toggleCompleteEvent();
    };

    const handleRegisterEventCompletion = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setLocPermErrorMsg("Location access not granted");
            return;
        }

        setLocationLoading(true);
        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        setLocationLoading(false);

        console.log(location.coords);
        console.log(location.timestamp);

        trainingEvent.registerCompletionTime(location.timestamp);
        trainingEvent.registerLocation(JSON.stringify(location.coords));
        // Write the location to the DB
        // Write the timestamp to completion time
    };

    const handleSaveComment = () => {
        console.log(commentText);
        trainingEvent.appendToComments(commentText, username);
        setCommentText("");
    };

    return (
        <ThemedView style={{ gap: 35 }}>
            <EventVillageDescription trainingEvent={trainingEvent} />
            {/* <View>
                <ThemedButton
                    title="Toggle Completion Time"
                    onPress={handleToggleCompletionTime}
                />
                {trainingEvent.completedAt ? (
                    <ThemedText>{`Completed at: ${format(
                        trainingEvent.completedAt,
                        "PPPPp"
                    )}`}</ThemedText>
                ) : (
                    <ThemedText>Completion time not yet recorded</ThemedText>
                )}
            </View> */}
            <View style={{ gap: 10 }}>
                <ThemedButton
                    title="Register Event Completion"
                    onPress={handleRegisterEventCompletion}
                />
                {locationLoading && (
                    <ThemedText>Capturing coordinates...</ThemedText>
                )}
                {trainingEvent.completedAt ? (
                    <ThemedText>{`Completed at:\n${format(
                        trainingEvent.completedAt,
                        "PPPPp"
                    )}`}</ThemedText>
                ) : (
                    <ThemedText>Completion time not yet recorded</ThemedText>
                )}
                {trainingEvent.location ? (
                    <ThemedText>{`Coordinates:\nLatitude - ${
                        JSON.parse(trainingEvent.location).latitude
                    }\nLongitude - ${
                        JSON.parse(trainingEvent.location).longitude
                    }\nAltitude - ${
                        JSON.parse(trainingEvent.location).altitude
                    }\nAccuracy - ${
                        JSON.parse(trainingEvent.location).accuracy
                    }`}</ThemedText>
                ) : (
                    <ThemedText>No location recorded</ThemedText>
                )}
            </View>
            <View style={{ gap: 10 }}>
                <ThemedText>Add Comment</ThemedText>
                <ThemedTextInput
                    placeholder="Write comments here"
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <ThemedButton
                    title="Save Comment"
                    onPress={handleSaveComment}
                />
                {trainingEvent.comments ? (
                    <ThemedText>{trainingEvent.comments}</ThemedText>
                ) : (
                    <ThemedText>No comments recorded</ThemedText>
                )}
            </View>
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: EventCompletionFormProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(EventCompletionForm);
