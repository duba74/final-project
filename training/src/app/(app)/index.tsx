import secondarySync from "@/database/secondary-data-pull";
import { useSession } from "@/hooks/useSession";
import { Href, Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";

const Index = () => {
    const { session, isLoading } = useSession();
    const [redirectPath, setRedirectPath] = useState<Href | null>(null);

    useEffect(() => {
        if (!isLoading && !redirectPath) {
            if (!session) {
                setRedirectPath("/auth" as Href);
            } else {
                try {
                    const user = JSON.parse(session).user;
                    if (user.role === "planner") {
                        setRedirectPath("/(app)/planner/villages" as Href);
                    } else if (user.role === "trainer") {
                        setRedirectPath("/(app)/trainer/villages" as Href);
                    } else if (user.role === "admin") {
                        setRedirectPath("/(app)/admin/home" as Href);
                    } else {
                        setRedirectPath("/(app)/norole/home" as Href);
                    }
                } catch (error) {
                    console.error(`Failed to parse session: ${error}`);
                    setRedirectPath("/auth" as Href);
                }
            }
        }
    }, [isLoading, session, redirectPath]);

    // Logging to help diagnose issues
    console.log("Session:", session);
    console.log("Is Loading:", isLoading);
    console.log("Redirect Path:", redirectPath);

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (redirectPath) {
        return <Redirect href={redirectPath} />;
    }

    return null;
};

export default Index;
