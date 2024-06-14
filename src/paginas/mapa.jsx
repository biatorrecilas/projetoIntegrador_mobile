import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Mapa = () => {
    const [location, setLocation] = useState(null);
    const [distances, setDistances] = useState([]);
    const [sensores, setSensores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);


    const sensorIds = [17, 109, 103, 107, 91];
    
    const handleMarkerPress = (sensor) => {
        setSelectedMarker(sensor);
        setModalVisible(true);
    };
    

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Obtém a localização inicial
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);

            // Inicia o monitoramento contínuo da posição
            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
                (newLocation) => {
                    setLocation(newLocation.coords);
                }
            );
        })();

        async function fetchSensores() {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const response = await axios.get('https://anabeatriztorrecilas.pythonanywhere.com/api/sensores/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const idSensores = response.data.filter(sensor => sensorIds.includes(sensor.id));
                setSensores(idSensores);
                setLoading(false);
            } catch (error) {
                setErrorMsg(error.message);
                setLoading(false);
                console.log(error);
            }
        }
        fetchSensores();
    }, []);

    useEffect(() => {
        if (location && sensores.length > 0) {
            calculateDistances(location);
        }
    }, [location, sensores]);

    // Função para calcular as distâncias entre a localização atual e os pontos
    const calculateDistances = (currentCoords) => {
        const points = sensores.map(sensor => ({
            name: sensor.localizacao,
            latitude: sensor.latitude,
            longitude: sensor.longitude
        }));

        const distancesArray = points.map(point => {
            const R = 6371; // Raio da Terra em quilômetros
            const dLat = deg2rad(point.latitude - currentCoords.latitude);
            const dLon = deg2rad(point.longitude - currentCoords.longitude);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(currentCoords.latitude)) * Math.cos(deg2rad(point.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distância em quilômetros
            return { name: point.name, distance: distance };
        });

        setDistances(distancesArray);
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const formatDistance = (distance) => {
        if (distance < 1) {
            // Se a distância for menor que 1 km, converte para metros
            return (distance * 1000).toFixed(0) + ' m';
        } else {
            // Se não, exibe em quilômetros
            return distance.toFixed(2) + ' km';
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Image source={require('../assets/LOGOSENAI.png')} style={styles.logo} />
            </View>
            {location ? (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Marcadores dos Sensores */}
                    {sensores.map(sensor => (
                        <Marker
                            key={sensor.id}
                            coordinate={{
                                latitude: sensor.latitude,
                                longitude: sensor.longitude,
                            }}
                            pinColor={'green'}
                            title={sensor.localizacao}
                            onPress={() => handleMarkerPress(sensor)}
                        />    
                    ))}

                    {/* Marcador da localização atual */}
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Você está aqui!"
                        description="Localização atual"
                    />
                </MapView>

            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.titulo}>INFORMAÇÕES DO SENSOR</Text>
                    <Text>ID: {selectedMarker?.id}</Text>
                    <Text>Localização: {selectedMarker?.localizacao}</Text>
                    <Text>Tipo: {selectedMarker?.tipo}</Text>
                    <Text>Responsável: {selectedMarker?.responsavel}</Text>
                    <Text>Latitude: {selectedMarker?.latitude}</Text>
                    <Text>Longitude: {selectedMarker?.longitude}</Text>
                    <Text>Valores: </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.botao}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Exibir latitude e longitude em tempo real */}
            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>Latitude: {location ? location.latitude : 'Loading...'}</Text>
                <Text style={styles.locationText}>Longitude: {location ? location.longitude : 'Loading...'}</Text>
            </View>

            {/* Exibir distâncias */}
            <View style={styles.distancesContainer}>
                {distances.length > 0 && distances.map((point, index) => (
                    <Text key={index} style={styles.distanceText}>
                        Distância até {point.name}: {formatDistance(point.distance)}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'black',
        height: 80,
        padding: 30,
    },
    logo: {
        width: 150,
        height: 40,
    },
    titulo: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        margin: 15,
        color: '#DE013F',
        textAlign: 'center'
    }, 
    locationContainer: {
        position: 'absolute',
        top: 100,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 10,
        zIndex: 2,
    },
    distancesContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 10,
        zIndex: 2,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    distanceText: {
        fontSize: 13,
        marginBottom: 5,
    },
    modalContent: {
        fontSize: 20,
        padding: 40,
    },
    botao: {
        backgroundColor: '#DE013F',
        padding: 10,
        borderRadius: 25,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
      },
});

export default Mapa;
