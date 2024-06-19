import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 

const schemaCadastro = z.object({
  usuario: z.string().min(5, 'O mínimo de caracteres é 5!').max(10, 'O máximo de caracteres é 10!'),
  email: z.string().min(10, 'O mínimo de caracteres é 10!').email('Informe um email válido!'),
  senha: z.string().min(6, 'Informe 6 caracteres!').max(8, 'O máximo de caracteres é 8!'),
  confirmarSenha: z.string()
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
});

export default function Cadastro({ navigation }) {
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schemaCadastro),
  });

  const handleCadastro = async (data) => {
    try {
      const token = await AsyncStorage.getItem('access_token'); 
      const adminUsername = 'smart_user'; 
      const adminPassword = '123456'; 

      const adminResponse = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/token', {
        username: adminUsername,
        password: adminPassword
      });

      const adminToken = adminResponse.data.access;

      const response = await axios.post('https://anabeatriztorrecilas.pythonanywhere.com/api/create_user', {
        username: data.usuario,
        email: data.email,
        password: data.senha
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      console.log("Usuário cadastrado com sucesso:", response.data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate('Login');

    } catch (error) {
      console.error("Erro no cadastro:", error);
      const errorMessage = error.response?.data?.detail || "Erro desconhecido";
      Alert.alert("Erro no cadastro", errorMessage);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formulario}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/projetoIntegrador.png')} style={estilos.logo} />
        </View>
        <Text style={estilos.titulo}>Parece que você é novo por aqui! Faça seu cadastro no Projeto Integrador Senai:</Text>
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
              placeholder="Email Address"
            />
          )}
          name="email"
          rules={{ required: true }}
        />
        {errors.email && (
          <Text style={estilos.mensagem}>{errors.email.message}</Text>
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
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={estilos.campo}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="Confirmar Senha"
            />
          )}
          name="confirmarSenha"
          rules={{ required: true }}
        />
        {errors.confirmarSenha && (
          <Text style={estilos.mensagem}>{errors.confirmarSenha.message}</Text>
        )}
        {errors.confirmarSenha && (
          <Text style={estilos.mensagem}>As senhas não coincidem.</Text>
        )}
        <TouchableOpacity onPress={handleSubmit(handleCadastro)}>
          <Text style={estilos.botao}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={estilos.botao}>Voltar</Text>
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
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  formulario: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
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
    marginTop: 10, 
  },
  mensagem: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DE003F',
    marginBottom: 10,
  },
});
