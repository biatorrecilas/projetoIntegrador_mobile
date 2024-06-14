import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Sair({ navigation }) {

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get('https://anabeatriztorrecilas.pythonanywhere.com/admin/logout/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        await AsyncStorage.removeItem('access_token');
        navigation.replace('Login');
      } else {
        Alert.alert('Erro', 'Erro ao fazer logout.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer logout: ' + error.message);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formulario}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/projetoIntegrador.png')} style={estilos.logo} />
        </View>
        <Text style={estilos.titulo}>Certeza que deseja sair?</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={estilos.botao}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DE013F',
  },
  titulo: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  formulario: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150, 
    height: 120, 
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
  },
});
