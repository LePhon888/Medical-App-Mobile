import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
/**
 * Display the map view
 * @param height (int) set the height of the map
 * @returns 
 */
const ViewMap = ({ height }) => {

    const fixedLocation = {
        latitude: 10.799236,
        longitude: 106.647138,
    };

    return (
        <View style={{ ...styles.container, height: height }}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: fixedLocation.latitude,
                    longitude: fixedLocation.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}>
                <Marker
                    coordinate={{
                        latitude: fixedLocation.latitude,
                        longitude: fixedLocation.longitude,
                    }}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default ViewMap;
