import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from '@react-navigation/native';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios'; // Certifique-se de instalar axios com npm install axios
import { baseURL } from '../Hook/config.js';

export default function Cadastro() {
    const navigation = useNavigation();

    // Estado para alternar a visibilidade da senha
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Esquema de validação com Yup
    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Digite um e-mail válido")
            .required("O e-mail é obrigatório"),
        password: yup
            .string()
            .min(8, "A senha deve ter no mínimo 8 caracteres")
            .required("A senha é obrigatória"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'As senhas não correspondem')
            .required("Confirmação de senha é obrigatória")
    });

    // Função para enviar os dados ao servidor
    const handleRegister = (values) => {
        Axios.post(`${baseURL}/Cadastro`, {
            email: values.email,
            password: values.password,
        }).then(response => {
            if (response.data.msg === "Cadastrado com sucesso") {
                // Assumindo que o backend retorna o ID do usuário cadastrado
                const userId = response.data.userId;
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                navigation.navigate('UsuarioSecundario', { userId: userId });
            } else {
                Alert.alert("Aviso", response.data.msg);
            }
        })
            .catch(error => {
                console.error(error.response ? error.response.data : error.message);
                Alert.alert("Erro", "Ocorreu um erro no cadastro. Tente novamente.");
            });
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Cadastre-se</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Formik
                        initialValues={{ email: '', password: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <>

                                <Text style={styles.title}>E-mail:</Text>
                                <TextInput
                                    placeholder="Digite um E-mail..."
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                <Text style={styles.errorText}>
                                    <ErrorMessage name="email" />
                                </Text>


                                <Text style={styles.title}>Senha:</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Sua Senha"
                                        style={styles.input}
                                        secureTextEntry={!showPassword}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="grey" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.errorText}>
                                    <ErrorMessage name="password" />
                                </Text>

                                <Text style={styles.title}>Confirme sua senha:</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Confirmação"
                                        style={styles.input}
                                        secureTextEntry={!showConfirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="grey" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.errorText}>
                                    <ErrorMessage name="confirmPassword" />
                                </Text>

                                <Animatable.View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Entrar')}>
                                        <Text style={styles.buttontext}>Anterior</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleSubmit} // Isso já cuida da validação e submit
                                    >
                                        <Text style={styles.buttontext}>Próximo</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                            </>
                        )}
                    </Formik>
                </ScrollView>
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
        flex: 1,
    },
    message: {
        marginTop: 50,
        marginBottom: 30,
        paddingStart: "5%",
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    containerForm: {
        flex: 2,
        backgroundColor: "white",
        paddingStart: "5%",
        paddingTop: 20,
        paddingBottom: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    title: {
        width: '100%',
        fontSize: 20,
        marginTop: 20,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        width: '100%',
        fontSize: 16,
        paddingVertical: '4%',
        paddingHorizontal: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
        backgroundColor: "#613CF0",
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttontext: {
        fontSize: 18,
        color: "#fff",
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    }
});
