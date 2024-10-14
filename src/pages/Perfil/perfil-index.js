import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Axios from 'axios';

export default function Perfil() {
  const navigation = useNavigation();
  const addPng = require("../../assets/Adicionar.png");
  const route = useRoute();
  const { userId } = route.params;

  const [usuarios, setUsuarios] = useState([]);
  const baseURL = Platform.OS === 'android' ? 'http://192.168.0.188:3001' : 'http://localhost:3001';

  useEffect(() => {
    console.log('User ID na tela Perfil:', userId); // Logando userId
    fetchUsuarios();
  }, [userId]);

  const fetchUsuarios = async () => {
    try {
      const response = await Axios.get(`${baseURL}/usuarios/${userId}`);
      console.log('Resposta da API:', response.data); // Logando a resposta da API
      if (response.data && Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        setUsuarios([]);  // Garante que seja um array
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsuarios([]);  // Em caso de erro, garante que usuarios seja um array vazio
    }
  };
  
  // Função para ordenar usuários por nome
  const ordenarUsuariosPorNome = (usuarios) => {
    return usuarios.sort((a, b) => {
      const nomeA = a.NOME.toUpperCase(); // Ignora maiúsculas
      const nomeB = b.NOME.toUpperCase(); // Ignora maiúsculas
      if (nomeA < nomeB) {
        return -1; // A vem antes
      }
      if (nomeA > nomeB) {
        return 1; // B vem antes
      }
      return 0; // São iguais
    });
  };

  // Ordena os usuários
  const usuariosOrdenados = ordenarUsuariosPorNome(usuarios);

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" delay={600} style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Entrar')} style={styles.buttonvolt}>
          <Icon name="chevron-left" size={35} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          <Text style={styles.message}>Perfis</Text>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1000} style={styles.containerForm}>
        {usuariosOrdenados.length > 0 && (
          <>
            <Text style={styles.title}>Responsável</Text>
            <UserProfile usuario={usuariosOrdenados[0]} userId={userId} />
            {usuariosOrdenados.length > 1 && (
              <>
                <Text style={styles.title}>Usuários</Text>
                <ScrollView>
                  {usuariosOrdenados.slice(1).map((usuario, index) => (
                    <UserProfile key={usuario.ID || index} usuario={usuario} userId={userId} />
                  ))}
                </ScrollView>
              </>
            )}
          </>
        )}

        <TouchableOpacity style={styles.buttonadd} onPress={() => navigation.navigate('UsuarioSecundario',{userId: userId})}>
          <Image source={addPng} style={styles.addimg} />
          <Text>Adicionar Novo Usuário</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const UserProfile = ({ usuario, userId }) => {
  const navigation = useNavigation();

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <TouchableOpacity 
      style={styles.user} 
      onPress={() => {
        console.log('infoUserId (ID do usuário):', usuario.ID); // Verifica se o valor está correto
        navigation.navigate('Home', { userId: userId, infoUserId: usuario.ID }); // Passando o ID correto para Home
      }}
    >
      <View style={styles.imageuser}></View>
      <View style={styles.userbox}>
        <Text style={styles.name}>{usuario.NOME || "Nome não disponível"}</Text>
        <Text>Idade: {calcularIdade(usuario.DATA_NASC)}</Text>
        <Text>Sexo: {usuario.SEXO === 'M' ? 'Masculino' : 'Feminino'}</Text>
        <View style={styles.line}></View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#613CF0",
  },
  message: {
    fontWeight: 'bold',
    fontSize: 25,
    color: "#fff",
  },
  containerHeader: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 5,
    paddingEnd: 25,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: 'space-between',
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: "black",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 40,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  user: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageuser: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    marginEnd: 6,
  },
  userbox: {
    flex: 1,
  },
  line: {
    marginTop: 10,
    height: 2,
    width: '100%',
    backgroundColor: "black"
  },
  buttonadd: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 40,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  buttonvolt: {
    color: "white",
    width: 30,
    height: 30,
    marginRight: 5,
  },
  addimg: {
    width: 80,
    height: 80,
    marginEnd: 10,
  }
});
