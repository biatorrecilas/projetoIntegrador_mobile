import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; 
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 

const schemaLogin = z.object({
  usuario: z.string().min(5, 'O mínimo de caracteres é 5!'),
  senha: z.string().min(6, 'Informe 6 caracteres!'),
});

export default function Login({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schemaLogin),
  });

  const obterDadosFormulario = async (data) => {
    try {
      const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/token', {
        username: data.usuario,
        password: data.senha
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      console.log(`Usuário: ${data.usuario}`);
      Alert.alert("Sucesso", "Bem-vindo ao Projeto Integrador!");
      navigation.navigate('MainTabs');

    } catch (error) {
      console.log('Erro na Autentificação', error);
      const errorMessage = error.response?.data?.detail || "Erro desconhecido";
      Alert.alert("Erro na Autentificação", errorMessage);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formulario}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/projetoIntegrador.png')} style={estilos.logo} />
        </View>
        <Text style={estilos.titulo}>Seja bem-vindo ao Projeto Integrador SENAI!</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={estilos.campo}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
            />
          )}
          name="usuario"
          rules={{ required: true }}
        />
        {errors.usuario && (
          <Text style={estilos.mensagem}>{errors.usuario.message}</Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={estilos.campo}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="Senha"
            />
          )}
          name="senha"
          rules={{ required: true }}
        />
        {errors.senha && (
          <Text style={estilos.mensagem}>{errors.senha.message}</Text>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={estilos.pequenosTextos}>É novo por aqui? Faça seu Cadastro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit(obterDadosFormulario)}>
          <Text style={estilos.botao}>Entrar</Text>
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
  campo: {
    backgroundColor: '#FFE4E4',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
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
  mensagem: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DE003F',
    marginBottom: 10,
  },
  logo: {
    width: 150, 
    height: 120, 
  },
  pequenosTextos: {
    fontSize: 12,
    color: '#DE003F',
    textAlign: 'center',
    marginVertical: 5,
  },
});
