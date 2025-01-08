import { Text } from "react-native";
// @ts-ignore
import { Redirect, Stack } from "expo-router";

import { useSession } from "../../hooks/ctx";

const AppLayout = () => {
    const { session, isLoading } = useSession();

    if (!session) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <Stack>
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default AppLayout;
