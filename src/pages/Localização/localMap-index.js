
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Animatable from "react-native-animatable";
import Icon from 'react-native-vector-icons/EvilIcons';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function Localizacao() {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Função para obter a localização
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setLoading(false);
            fetchNearbyPharmacies(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    // Função para buscar farmácias próximas usando Overpass API (OpenStreetMap)
    const fetchNearbyPharmacies = async (latitude, longitude) => {
        try {
            const radius = 100000; // Distância em metros para buscar farmácias próximas
            const overpassUrl = "https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=pharmacy](around:${radius},${latitude},${longitude});out;;"

            let response = await fetch(overpassUrl);
            let data = await response.json();

            const pharmacies = data.elements.map((element) => ({
                id: element.id,
                name: element.tags.name,
                latitude: element.lat,
                longitude: element.lon,
            }));

            setPharmacies(pharmacies);
        } catch (error) {
            console.log(error);
        }
    };

    // Tratamento de erro de localização
    if (errorMsg) {
        return <Text>{errorMsg}</Text>;
    }

    // Mostrando um indicador de carregamento enquanto a localização é obtida
    if (loading || !location) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInUpBig" style={styles.containerForm}>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Icon name="close" size={40} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.message}>Localização</Text>
                </View>
                <Text style={styles.text}>
                    Localização das farmácias conhecidas que são registradas no google maps, raio de 100km
                </Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {/* Carregar tiles do OpenStreetMap */}
                        <UrlTile
                            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maximumZ={19}
                        />

                        {/* Marcador da localização atual */}
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Você está aqui"
                            description="Esta é a sua localização atual"
                        />

                        {/* Marcadores das farmácias próximas */}
                        {pharmacies.map((pharmacy) => (
                            <Marker
                                key={pharmacy.id}
                                coordinate={{
                                    latitude: pharmacy.latitude,
                                    longitude: pharmacy.longitude,
                                }}
                                title={pharmacy.name}
                                description="Farmácia"
                                pinColor="green"
                            />
                        ))}
                    </MapView>
                </View>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#613CF0",
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginTop: 15,
        marginBottom: 15,
        position: "absolute",
    },
    message: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: 28,
        fontWeight: "bold",
        margin: "auto",
    },
    containerForm: {
        flex: 1,
        padding: '5%',
        backgroundColor: "white",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    text: {
        fontSize:20,
        textAlign:'center',
        margin:15,
    }
});