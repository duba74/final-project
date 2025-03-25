import EventRegistration from "@/components/event-details/EventRegistration";
import { useSession } from "@/hooks/useSession";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

const EventRegistrationPage = () => {
    const { session } = useSession();
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const parseUser = () => {
            if (!session) {
                console.log("No session");
                setUsername("");
            } else {
                const user = JSON.parse(session).user;
                setUsername(user.username);
            }
        };

        parseUser();
    }, [session]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <EventRegistration
                username={username}
                trainingEventId={trainingEventId}
            />
        </ScrollView>
    );
};

export default EventRegistrationPage;
