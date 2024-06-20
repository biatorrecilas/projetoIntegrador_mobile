import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GraficoContador = ({ sensorId }) => {
    const [contador, setContador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchContadorData() {
            try {
                const token = await AsyncStorage.getItem('access_token');
                const requestData = {
                    sensor_id: sensorId,
                    // timestamp_gte: "2024-04-01T00:00:00",
                    // timestamp_lt: "2024-04-30T00:00:00"
                };
                const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/contador_filter/', requestData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const count = response.data.count;

                setContador(count);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchContadorData();
    }, [sensorId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Erro ao carregar os dados: {error.message}</Text>;
    }

    const data = {
        labels: ['Total de Registros no Contador'],
        datasets: [
            {
                label: 'Total',
                data: [contador],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, 
        barPercentage: 0.5,
        useShadowColorFromDataset: false 
    };

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Icon name="counter" size='50px' color='#DE013F'/>
            </View>
            <Text style={styles.total}>Total de registros: {contador}</Text>
            <BarChart
                style={styles.chart}
                data={data}
                width={400}
                height={400}
                chartConfig={chartConfig}
                verticalLabelRotation={0.5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 10,
    },
    description: {
        color: 'white',
        marginBottom: 10,
    },
    total: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    }
});

export default GraficoContador;
