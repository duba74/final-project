import { Stack } from "expo-router";

const TrainingEventLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="(training-event)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="participant-modal"
                options={{
                    headerShown: false,
                    presentation: "modal",
                }}
            />
        </Stack>
    );
};

export default TrainingEventLayout;
