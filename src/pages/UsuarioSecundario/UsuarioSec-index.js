import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, Alert, Platform
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as Animatable from "react-native-animatable";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function UsuarioSecundario() {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;
    const baseURL = Platform.OS === 'android' ? 'http://192.168.0.188:3001' : 'http://localhost:3001';


    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('F');

    useEffect(() => {
        console.log('UsuarioSecundario montado. userId recebido:', userId);
    }, [userId]);

    const formatarData = (texto) => {
        const numeros = texto.replace(/\D/g, '');
        let dataFormatada = '';
        if (numeros.length > 0) {
            dataFormatada += numeros.substring(0, 2);
            if (numeros.length > 2) {
                dataFormatada += '/' + numeros.substring(2, 4);
                if (numeros.length > 4) {
                    dataFormatada += '/' + numeros.substring(4, 8);
                }
            }
        }
        return dataFormatada;
    };

    const handleDataNascimento = (texto) => {
        const dataFormatada = formatarData(texto);
        setDataNascimento(dataFormatada);
    };

    const handleSubmit = async () => {
        console.log('Iniciando handleSubmit');
        if (!nome || dataNascimento.length !== 10) {
            Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
            return;
        }

        const [dia, mes, ano] = dataNascimento.split('/');
        const dataFormatadaParaEnvio = `${ano}-${mes}-${dia}`;

        try {
            console.log('Enviando dados:', { nome, data_nasc: dataFormatadaParaEnvio, sexo, id_users: userId });
            const response = await axios.post(`${baseURL}/usuarioSecundario`, {
                nome,
                data_nasc: dataFormatadaParaEnvio,
                sexo,
                id_users: userId
            });

            console.log('Resposta do servidor:', response.data);
            Alert.alert("Sucesso", "Usuário secundário cadastrado com sucesso!");
            console.log('Tentando navegar para Perfil com userId:', userId);
            navigation.navigate('Perfil', { userId });
            console.log('Navegação para Perfil concluída');
        } catch (error) {
            console.error('Erro ao cadastrar usuário secundário:', error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível cadastrar o usuário secundário. " + (error.response?.data?.msg || error.message));
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Novo Usuário</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Nome:</Text>
                <TextInput
                    placeholder="Nome"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                />

                <Text style={styles.title}>Data de Nascimento:</Text>
                <TextInput
                    placeholder="DD/MM/AAAA"
                    style={styles.input}
                    value={dataNascimento}
                    onChangeText={handleDataNascimento}
                    keyboardType="numeric"
                    maxLength={10}
                />

                <Text style={styles.title}>Informe seu Sexo Biológico:</Text>
                <Picker
                    selectedValue={sexo}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSexo(itemValue)}
                >
                    <Picker.Item label="Feminino" value="F" />
                    <Picker.Item label="Masculino" value="M" />
                </Picker>

                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.buttontext}>Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { marginTop: 20 }]}
                        onPress={async () => {
                            if (nome && dataNascimento.length === 10) {
                                console.log('Dados válidos, tentando fazer o submit.');
                                await handleSubmit(); // Primeiro faz o submit
                            } else {
                                Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
                            }
                        }}
                    >
                    <Text style={styles.buttontext}>
                        Cadastrar
                    </Text>
                    </TouchableOpacity>

                </View>
            </Animatable.View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#613CF0",
    },
    message: {
        marginTop: 100,
        marginBottom: 100,
        paddingStart: "5%",
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    containerForm: {
        flex: 1,
        backgroundColor: "white",
        paddingStart: "5%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        marginRight: "5%",
        fontSize: 16,
    },
    picker: {
        marginTop: 5,
        fontSize: 18,
        marginRight: "5%",
    },
    button: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttontext: {
        fontSize: 20,
        color: "#fff",
        backgroundColor: "#613CF0",
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginRight: '5%',
        borderRadius: 10,
    },
})