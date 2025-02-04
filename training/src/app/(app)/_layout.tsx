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

    return <Stack />;
};

export default AppLayout;

// import { Text } from "react-native";
// import { Href, Redirect, Stack } from "expo-router";
// import { useSession } from "@/hooks/useSession";
// import { useEffect, useState, useMemo } from "react";

// const AppLayout = () => {
//     const { session, isLoading } = useSession();

//     const redirectPath = useMemo(() => {
//         if (isLoading) {
//             return null;
//         }

//         if (!session) {
//             return "/auth";
//         }

//         try {
//             const user = JSON.parse(session).user;
//             if (user.role === "planner") {
//                 return "/(app)/planner/home";
//             } else if (user.role === "trainer") {
//                 return "/(app)/trainer/home";
//             } else if (user.role === "admin") {
//                 return "/(app)/admin/home";
//             } else {
//                 return "/";
//             }
//         } catch (error) {
//             console.error(`Failed to parse session: ${error}`);
//             return "/auth";
//         }
//     }, [isLoading, session]);

//     useEffect(() => {
//         // Logging for debugging purposes
//         console.log("Session:", session);
//         console.log("Is Loading:", isLoading);
//         console.log("Redirect Path:", redirectPath);
//     }, [session, isLoading, redirectPath]);

//     if (isLoading) {
//         return <Text>Loading...</Text>;
//     }

//     if (redirectPath) {
//         return <Redirect href={redirectPath} />;
//     }
//     // const [redirectPath, setRedirectPath] = useState<Href | null>(null);

//     // const handleRedirect = () => {
//     //     if (!isLoading) {
//     //         if (!session) {
//     //             return "/auth";
//     //         } else {
//     //             try {
//     //                 const user = JSON.parse(session).user;
//     //                 if (user.role === "planner") {
//     //                     return "/(app)/planner/home";
//     //                 } else if (user.role === "trainer") {
//     //                     return "/(app)/trainer/home";
//     //                 } else if (user.role === "admin") {
//     //                     return "/(app)/admin/home";
//     //                 } else {
//     //                     return "/";
//     //                 }
//     //             } catch (error) {
//     //                 console.error(`Failed to parse session: ${error}`);
//     //                 return "/auth";
//     //             }
//     //         }
//     //     }
//     // };

//     // useEffect(() => {
//     //     if (!isLoading) {
//     //         const path = handleRedirect() as Href;
//     //         setRedirectPath(path);
//     //     }
//     // }, [isLoading, session, redirectPath]);

//     // if (isLoading) {
//     //     return <Text>Loading...</Text>;
//     // }

//     // if (redirectPath) {
//     //     return <Redirect href={redirectPath} />;
//     // }

//     return <Stack />;
// };

// export default AppLayout;
