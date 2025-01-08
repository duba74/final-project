import * as er from "expo-router";
import { Text, View } from "react-native";

import { useSession } from "../hooks/ctx";

const SignIn = () => {
    const { signIn } = useSession();
};

export default SignIn;
