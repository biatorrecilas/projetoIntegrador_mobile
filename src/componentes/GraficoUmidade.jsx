import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const GraficoUmidade = ({ sensorId }) => {
    const [umidades, setUmidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUmidadeData() {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const requestData = {
                    sensor_id: sensorId,
                    // valor_gte: 10,
                    // valor_lt: 80,
                    // timestamp_gte: "2024-04-01T00:00:00",
                    // timestamp_lt: "2024-04-02T00:00:00"
                };
                const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/umidade_filter/', requestData, {
                    params: {
                        limit: 1000
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                const valores = data.map(item => item.valor);
                setUmidades(valores); // Armazenar os valores de umidade

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchUmidadeData();
    }, [sensorId]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Erro ao carregar os dados: {error.message}</Text>;

    // Função para calcular a média dos valores de umidade
    const calcularMedia = () => {
        if (umidades.length === 0) return 0;

        const soma = umidades.reduce((acc, curr) => acc + curr, 0);
        return soma / umidades.length;
    };

    return (
        <View style={styles.container}>
            <Icon name="water-percent" size='50px' color='#DE013F' />
            <Text style={styles.chartTitle}>Média de Umidade</Text>
            <Text style={styles.mediaText}>{calcularMedia().toFixed(2)} %</Text>
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

export default GraficoUmidade;
