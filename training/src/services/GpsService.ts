import * as Location from "expo-location";

export const getGpsLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        return false;
    }

    return true;
};

export const getGpsLocation = async () => {
    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return location;
};
