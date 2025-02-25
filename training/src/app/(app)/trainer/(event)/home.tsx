import { Redirect } from "expo-router";

const NavigateHome = () => {
    return <Redirect href={"/(app)/trainer/(home)/home"} />;
};

export default NavigateHome;
