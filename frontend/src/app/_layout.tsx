import { Stack } from "expo-router";
import { SessionProvider } from "../hooks/ctx";

const StackLayout = () => {
    return <Stack></Stack>;
};

const Root = () => {
    <SessionProvider>
        <StackLayout />
    </SessionProvider>;
};

export default Root;
