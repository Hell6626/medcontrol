import React from "react";
import { Platform, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import { baseURL } from '../Hook/config.js';

export default function Entrar() {
    const navigation = useNavigation();

    const validationSchema = yup.object().shape({
        email: yup.string().email("Digite um e-mail válido").required("O e-mail é obrigatório"),
        password: yup.string()
            .min(8, "A senha deve ter no mínimo 8 caracteres") // Corrigido para 8 caracteres
            .required("A senha é obrigatória"),
    });

    const handleLogin = async (values) => {
        Axios.post(`${baseURL}/Login`, {
            email: values.email,
            password: values.password,
        }).then(response => {
            console.log('Resposta do servidor:', response.data); // Log da resposta
            alert(response.data.message);
            if (response.data.message === "Usuário logado com sucesso") {
                const userId = response.data.userId;
                navigation.navigate('Perfil', { userId: userId });
            }
        }).catch(error => {
            console.error(error.response ? error.response.data : error.message);
            alert("Erro ao fazer login. Por favor, tente novamente.");
        });

    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem-vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <>
                            <Text style={styles.title}>E-mail:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            <Text style={styles.errorText}>
                                <ErrorMessage name="email" />
                            </Text>

                            <Text style={styles.title}>Senha:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Sua Senha"
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                            />
                            <Text style={styles.errorText}>
                                <ErrorMessage name="password" />
                            </Text>

                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Acessar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>

                <TouchableOpacity style={styles.registerbutton} onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#613CF0",
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: "8%",
        paddingStart: "5%",
    },
    message: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    containerForm: {
        backgroundColor: "#fff",
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: "5%",
        paddingEnd: "5%",
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    errorText: {
        color: "red",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#613CF0",
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    registerbutton: {
        marginTop: 12,
        alignSelf: "center",
    },
    registerText: {
        color: "grey",
    }
});
