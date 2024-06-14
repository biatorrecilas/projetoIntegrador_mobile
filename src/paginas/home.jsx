import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Home({ navigation }) {
    const [temperatura, setTemperatura] = useState(null);
    const [dataHora, setDataHora] = useState(null);

    useEffect(() => {
        const buscarTemperatura = async () => {
            try {
                const resposta = await axios.get(
                    'https://api.openweathermap.org/data/2.5/weather?q=Campinas,BR&appid=498d583deec6220889bd84df55ac7ae8&units=metric'
                );
                setTemperatura(resposta.data.main.temp);
            } catch (erro) {
                console.error('Erro ao buscar a temperatura:', erro);
            }
        };

        const buscarDataHora = () => {
            const dataAtual = new Date();
            const diaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
            const diaDaSemana = diaSemana[dataAtual.getDay()];
            const diaDoMes = dataAtual.getDate();
            const mes = dataAtual.toLocaleString('pt-BR', { month: 'long' });
            const ano = dataAtual.getFullYear();
            const hora = String(dataAtual.getHours()).padStart(2, '0');
            const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
            const dataHoraFormatada = `${hora}:${minutos} ${diaDaSemana}, ${diaDoMes} de ${mes} de ${ano}`;

            setDataHora(dataHoraFormatada);
        };

        buscarTemperatura();
        buscarDataHora();

        const temperaturaInterval = setInterval(buscarTemperatura, 600000);
        const dataHoraInterval = setInterval(buscarDataHora, 60000);

        return () => {
            clearInterval(temperaturaInterval);
            clearInterval(dataHoraInterval);
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={estilos.header}>
                <Image source={require('../assets/LOGOSENAI.png')} style={estilos.logo} />
            </View>
            <View style={estilos.container}>
                <Image source={require('../assets/imagemSenai.png')} style={estilos.backgroundImage} />
                <View style={{ marginTop: 80, backgroundColor: 'transparent' }}>
                    <Text style={[estilos.texto, { marginTop: 20}]}>
                        Campinas, {temperatura !== null ? `${temperatura}°C` : 'Carregando...'}
                    </Text>
                </View>
                <View style={estilos.linha}></View>
                <Text style={estilos.texto}>{dataHora !== null ? dataHora : 'Carregando...'}</Text>
                <TouchableOpacity style={estilos.botao}>
                    <Text style={estilos.botaoTexto}>Ana Beatriz Torrecilas - 2DSMB-A</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        backgroundColor: 'black',
        height: 80,
        padding: 30,
        width: '100%',
    },
    logo: {
        width: 150,
        height: 40,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        
    },
    texto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    linha: {
        width: '70%',
        height: 2,
        backgroundColor: 'white',
        marginVertical: 10,
        opacity: 0.3,
    },
    botao: {
        backgroundColor: '#DE013F',
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    botaoTexto: {
        color: 'white',
        fontSize: 18,
    },
});
