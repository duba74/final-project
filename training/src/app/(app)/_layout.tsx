import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/hooks/useSession";

const AppLayout = () => {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!session) {
        return <Redirect href="/auth" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
