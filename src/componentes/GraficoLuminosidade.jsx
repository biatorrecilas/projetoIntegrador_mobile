import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Entypo';

const GraficoLuminosidade = ({ sensorId }) => {
    const [luminosidades, setLuminosidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLuminosidadeData() {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const requestData = {
                    sensor_id: sensorId,
                    // valor_gte: 10,
                    // valor_lt: 1000,
                    // timestamp_gte: "2024-04-21T00:00:00",
                    // timestamp_lt: "2024-04-22T00:00:00"
                };
                const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/luminosidade_filter/', requestData, {
                    params: {
                        limit: 1000
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                const valores = data.map(item => item.valor);
                setLuminosidades(valores); // Armazenar os valores de luminosidade

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchLuminosidadeData();
    }, [sensorId]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Erro ao carregar os dados: {error.message}</Text>;

    // Função para calcular a média dos valores de luminosidade
    const calcularMedia = () => {
        if (luminosidades.length === 0) return 0;

        const soma = luminosidades.reduce((acc, curr) => acc + curr, 0);
        return soma / luminosidades.length;
    };

    return (
        <View style={styles.container}>
            <Icon name="light-up" size='50px' color='#DE013F' />
            <Text style={styles.chartTitle}>Média de Luminosidade</Text>
            <Text style={styles.mediaText}>{calcularMedia().toFixed(2)} lux</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#dbd3d5',
        padding: 30,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    chartTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    mediaText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default GraficoLuminosidade;
