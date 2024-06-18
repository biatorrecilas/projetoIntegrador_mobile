import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const GraficoTemperatura = ({ sensorId }) => {
    const [temperaturas, setTemperaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTemperaturaData() {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const requestData = {
                    sensor_id: sensorId,
                    valor_gte: 10,
                    valor_lt: 34,
                    timestamp_gte: "2024-04-01T00:00:00",
                    timestamp_lt: "2024-04-02T00:00:00"
                };
                const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/temperatura_filter/', requestData, {
                    params: {
                        limit: 1000
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                const valores = data.map(item => item.valor);
                setTemperaturas(valores); // Armazenar os valores de temperatura

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchTemperaturaData();
    }, [sensorId]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Erro ao carregar os dados: {error.message}</Text>;

    // Função para calcular a média dos valores de temperatura
    const calcularMedia = () => {
        if (temperaturas.length === 0) return 0;

        const soma = temperaturas.reduce((acc, curr) => acc + curr, 0);
        return soma / temperaturas.length;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Média da Temperatura</Text>
            <Text style={styles.mediaText}>{calcularMedia().toFixed(2)} °C</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10,
        color: '#fff'
    },
    mediaText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#fff'
    },
});

export default GraficoTemperatura;
