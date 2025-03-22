import EventRegistration from "@/components/event-form/EventRegistration";
import { useSession } from "@/hooks/useSession";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

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
        <EventRegistration
            username={username}
            trainingEventId={trainingEventId}
        />
    );
};

export default EventRegistrationPage;
