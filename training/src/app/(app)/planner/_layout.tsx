import { Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSession } from "@/hooks/useSession";
import { useEffect } from "react";

const PlannerLayout = () => {
    const { session, isLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (
            !isLoading &&
            (!session || JSON.parse(session).user.role !== "planner")
        ) {
            router.replace("/auth");
        }
    }, [isLoading, session, router]);

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading || !session) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.

    // This layout can be deferred because it's not the root layout.
    return <Stack />;
};

export default PlannerLayout;
