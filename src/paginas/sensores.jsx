import React, { useState, useEffect } from "react"; 
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native"; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from "axios"; 
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Filtro } from "../componentes/Filtro";

export default function Sensores() { 
    const [sensores, setSensores] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => { 
        async function fetchSensores() { 
            try { 
                const token = await AsyncStorage.getItem('access_token');
                const response = await axios.get('https://anabeatriztorrecilas.pythonanywhere.com/api/sensores/', { 
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    } 
                }); 
                setSensores(response.data); 
                setLoading(false); 
            } catch (error) { 
                setError(error); 
                setLoading(false); 
                console.log(error) 
            } 
        } 
        fetchSensores(); 
    }, []); 

    const atualizarSensoresFiltrados = (sensoresFiltrados) => {
        setSensores(sensoresFiltrados);
    };

    if (loading) { 
        return <View><Text>Carregando...</Text></View>;  
    } 
    if (error) { 
        return <View><Text>Erro ao carregar os dados: {error.message}</Text></View>; 
    } 

    return ( 
        <View style={styles.container}> 
            <Text style={styles.title}>Monitoramento de Sensores</Text> 
            <Text style={styles.title}>Senai “Roberto Mange”</Text> 
            <ScrollView style={styles.scrollView}>
                <Filtro atualizarSensoresFiltrados={atualizarSensoresFiltrados} />
                <View style={styles.sensoresContainer}> 
                    {sensores.map(sensor => ( 
                        <View key={sensor.id} style={styles.sensor}> 
                            <Text style={styles.text}>ID: {sensor.id}</Text> 
                            <Text style={styles.text}>{'Tipo: '}<Text style={[{color: '#DE013F', fontWeight: 'bold'}]}>{sensor.tipo}</Text></Text>  
                            <Text style={styles.text}>Responsável: {sensor.responsavel}</Text> 
                            <Text style={styles.text}>Longitude: {sensor.longitude}</Text> 
                            <Text style={styles.text}>Latitude: {sensor.latitude}</Text> 
                            <View style={styles.alinhar}> 
                                <View style={styles.localizacao}> 
                                    <Text style={styles.mapMarker}><Icon name="location-dot"/></Text> 
                                    <View style={{ maxWidth: '80%' }}>  
                                        <Text style={styles.localizacao}>Localização: {sensor.localizacao}</Text> 
                                    </View> 
                                </View> 
                            </View> 
                        </View> 
                    ))} 
                </View>
            </ScrollView>
        </View> 
    ) 
} 

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: '#dbd3d5', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 20, 
    }, 
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 5,
        
    }, 
    scrollView: {
        flex: 1,
        width: '100%',
    },
    sensoresContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
    }, 
    sensor: { 
        marginBottom: 20, 
        padding: 10, 
        backgroundColor: 'black', 
        borderRadius: 10, 
        width: '90%', 
        boxSizing: 'border-box', 
    }, 
    text: { 
        color: 'white', 
    }, 
    mapMarker: { 
        margin: 10, 
        color: '#DE013F', 
    }, 
    localizacao: { 
        backgroundColor: '#fff', 
        padding: 5, 
        marginTop: 5,
        borderRadius: 20, 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%', 
        flexDirection: 'row', 
        color: '#000',
    }, 
    alinhar: { 
        alignItems: 'center', 
        justifyContent: 'center', 
    } 
});
