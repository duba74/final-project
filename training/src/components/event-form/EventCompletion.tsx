import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedView from "@/components/themed/ThemedView";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View } from "react-native";
import { format } from "date-fns";
import { trainingEventCollection } from "@/database/database";
import EventVillageDescription from "./EventVillageDescription";
import {
    getGpsLocation,
    getGpsLocationPermission,
} from "@/services/GpsService";

type EventCompletionProps = {
    username: string;
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const EventCompletion = ({
    username,
    trainingEventId,
    trainingEvent,
}: EventCompletionProps) => {
    const [commentText, setCommentText] = useState("");
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleRegisterEventCompletion = async () => {
        const permission = await getGpsLocationPermission();
        setHasLocationPermission(permission);
        if (!permission) return;

        setLocationLoading(true);
        const location = await getGpsLocation();
        setLocationLoading(false);

        trainingEvent.registerCompletionTime(location.timestamp);
        trainingEvent.registerLocation(JSON.stringify(location.coords));
    };

    const handleSaveComment = () => {
        trainingEvent.appendToComments(commentText, username);
        setCommentText("");
    };

    return (
        <ThemedView style={{ gap: 35 }}>
            <EventVillageDescription trainingEvent={trainingEvent} />
            <View style={{ gap: 10 }}>
                <ThemedButton
                    title="Register Event Completion"
                    onPress={handleRegisterEventCompletion}
                />
                {!hasLocationPermission && (
                    <ThemedText>Location permissions not granted!</ThemedText>
                )}
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
    ({ trainingEventId }: EventCompletionProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(EventCompletion);
