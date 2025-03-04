import EventCompletion from "@/components/event-form/EventCompletion";
import { useSession } from "@/hooks/useSession";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const EventCompletionPage = () => {
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
        <EventCompletion
            username={username}
            trainingEventId={trainingEventId}
        />
    );
};

export default EventCompletionPage;
