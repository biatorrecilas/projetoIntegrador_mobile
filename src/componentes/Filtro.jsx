import React, { useState } from 'react';
import { View, Text, TouchableOpacity , ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Filtro({ atualizarSensoresFiltrados }) {
    const [filters, setFilters] = useState({
        tipo: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (name, value) => {
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.post(
                'https://anabeatriztorrecilas.pythonanywhere.com/api/sensor_filter/',
                filters, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            atualizarSensoresFiltrados(response.data);
        } catch (error) {
            console.error('Error fetching sensors:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formulario}>
                <View style={styles.filtroLinha}>
                    <Picker
                        selectedValue={filters.tipo}
                        style={styles.campo}
                        onValueChange={(itemValue) => handleChange('tipo', itemValue)}
                    >
                        <Picker.Item label="Selecione um Tipo" value="" />
                        <Picker.Item label="Temperatura" value="Temperatura" />
                        <Picker.Item label="Contador" value="Contador" />
                        <Picker.Item label="Luminosidade" value="Luminosidade" />
                        <Picker.Item label="Umidade" value="Umidade" />
                    </Picker>
                </View>
                <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
                    <Text style={styles.textoBotao}>Filtrar</Text>
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.error}>Erro ao buscar sensores: {error.message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
    },
    formulario: {
        flexDirection: 'column',
        padding: 2,
        borderRadius: 10,
        width: '100%'
    },
    filtroLinha: {
        marginBottom: 0,
    },
    campo: {
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        borderColor: '#FFE4E4',
        borderWidth: 1,
    },
    error: {
        color: 'red',
        marginTop: 20,
    },
    botao: {
        borderRadius: 8,
        paddingTop: 5,
        alignItems: 'center',
    },
    textoBotao: {
        fontSize: 14,
        color: '#DE013F',
        fontWeight: 'bold',
    },
});
