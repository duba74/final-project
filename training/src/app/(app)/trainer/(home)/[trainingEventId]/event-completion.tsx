import EventCompletionForm from "@/components/trainer-event-form/EventCompletionForm";
import { useSession } from "@/hooks/useSession";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const EventCompletion = () => {
    const { session } = useSession();
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();
    const [username, setUsername] = useState("");

    console.log("trainingEventId: " + trainingEventId);

    useEffect(() => {
        const parseUser = () => {
            if (!session) {
                console.log("No session");
                setUsername("");
            } else {
                const user = JSON.parse(session).user;
                console.log(user);
                setUsername(user.username);
            }
        };

        parseUser();
    }, [session]);

    return (
        <EventCompletionForm
            username={username}
            trainingEventId={trainingEventId}
        />
    );
};

export default EventCompletion;
