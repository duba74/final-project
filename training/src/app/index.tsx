import { Text, View } from "react-native";

const Home = () => {
    return (
        <View
            testID="home-component"
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Editzz app/index.tsx to edit this screen.</Text>
        </View>
    );
};

export default Home;
