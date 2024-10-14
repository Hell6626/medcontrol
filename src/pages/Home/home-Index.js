import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, Animated, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import useFetchData from '../Hook/useFetchData.js'; // Importa o hook customizado

export default function Home() {
    const navigation = useNavigation();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const animatedValue = useRef(new Animated.Value(-200)).current;
    const route = useRoute();
    const { userId, infoUserId } = route.params; 
    const [medicamentos, setMedicamentos] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');

    // Usa o hook customizado para buscar medicamentos
    const fetchMedicamentos = async () => {
        try {
            const response = await fetch(`http://192.168.0.188:3001/medicamento/${infoUserId}`);
            const data = await response.json();
            setMedicamentos(data);
        } catch (error) {
            console.error("Erro ao buscar medicamentos:", error);
        }
    };

    // Passa a função fetchMedicamentos para o hook
    useFetchData(fetchMedicamentos);

    // Use useEffect para chamar fetchMedicamentos ao entrar na página
    useEffect(() => {
        fetchMedicamentos();
    }, [infoUserId]); // Adicione infoUserId como dependência para atualizar quando mudar

    const toggleSidebar = () => {
        const toValue = isSidebarVisible ? -200 : 0;
        Animated.timing(animatedValue, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsSidebarVisible(!isSidebarVisible);
    };

    const menuPng = require("../../assets/menuIcon.png");

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: animatedValue }] }]}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                    <Icon name="chevron-left" size={40} color="#fff" />
                    <Text style={styles.titulo}>MedControl.</Text>
                </TouchableOpacity>
                <View style={styles.linha}></View>
                <TouchableOpacity style={styles.user} onPress={() => navigation.navigate('Perfil', { userId: userId })}>
                    <View style={styles.image}></View>
                    <Text style={styles.sidebarButtonText}>Perfis</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('EditProfile')}>
                    <Icon name="cog" size={30} color='#fff' />
                    <Text style={styles.sidebarButtonText}>Configurações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate('Localização')}>
                    <Icon name="location-pin" size={30} color='#fff' />
                    <Text style={styles.sidebarButtonText}>Localização</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarButtonExit} onPress={() => navigation.navigate('MedControl')}>
                    <Icon name="log-out" size={30} color='#fff' />
                    <Text style={styles.sidebarButtonText}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Botão de Menu */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
                <Image source={menuPng} style={styles.menuButton}></Image>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={() => {
                console.log(infoUserId); // Verifica se o valor está correto
                navigation.navigate('MedAdd', { userId: userId, infoUserId: infoUserId }); 
            }}>
                <Icon2 name="notes-medical" size={30} color='#fff' style={styles.addButton} />
            </TouchableOpacity>

            {/* Conteúdo Principal */}
            <View style={styles.mainContent}>
                <Animatable.View animation="fadeInDown" delay={400} style={styles.containerHeader}>
                    <Text style={styles.message}>Home</Text>
                    <Animatable.View animation="fadeInLeft" delay={600} style={styles.boxSearch}>
                        <Icon name="magnifying-glass" size={24} color="#000" />
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Pesquisar..."
                            value={searchQuery}
                            onChangeText={text => setSearchQuery(text)}
                        />
                    </Animatable.View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={600} style={styles.containerForm}>
                    <MedList medicamentos={medicamentos} userId={userId} infoUserId={infoUserId} />
                </Animatable.View>
            </View>
        </View>
    );
};

const MedList = ({ medicamentos, userId, infoUserId }) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.medListContainer}>
                {medicamentos.length > 0 ? (
                    medicamentos.map((med, index) => (
                        <Med key={index} med={med} userId={userId} infoUserId={infoUserId} />
                    ))
                ) : (
                    <Text style={styles.noMedicamentos}>Nenhum medicamento cadastrado.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const Med = ({ med, userId, infoUserId }) => {
    const navigation = useNavigation();
    const [proximoHorario, setProximoHorario] = useState('');

    useEffect(() => {
        const calcularProximoHorario = () => {
            const horarioAtual = new Date();
            const intervaloHoras = med.intervalo;
            const proximoHorario = new Date(horarioAtual.getTime() + intervaloHoras * 60 * 60 * 1000);
            return proximoHorario;
        };

        const atualizarHorario = () => {
            const proximo = calcularProximoHorario();
            setProximoHorario(proximo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        atualizarHorario();
        const intervalId = setInterval(atualizarHorario, 60000);
        return () => clearInterval(intervalId);
    }, [med.intervalo]);

    return (
        <View style={styles.med}>
            <View style={styles.medbox}>
                <Text style={styles.name2}>{med.produto}</Text>
                <Text style={styles.title}>Dosagem: {med.dose}</Text>
            </View>
            <Text style={styles.time}>{proximoHorario}</Text>
        </View>
    );
};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    mainContent: {
        flex: 1,
        backgroundColor: "white",
    },
    message: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 25,
        color: "#fff",
        textAlign: "center",
    },
    noMedicamentos: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
    },
    containerHeader: {
        paddingTop: 10,
        paddingBottom: 10,
        height: 150,
        backgroundColor: "#613CF0",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        zIndex: 5,
    },
    profileHeader: {
        marginTop: 10,
        flexDirection: "row",
    },
    name: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingEnd: 10,
        color: "white",
        textAlignVertical: "center",
    },
    name2: {
        fontWeight: 'bold',
        fontSize: 20,
        color: "black",
    },
    image: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: '#fff',
        width: 30,
        height: 30,
    },
    containerForm: {
        paddingTop: 40,
        paddingHorizontal: 1,
        zIndex: 5,
    },
    title: {
        fontSize: 15,
        marginTop: 9,
    },
    med: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 20,
        padding: 25,
        marginHorizontal: '10%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medbox: {
    },
    time: {
        fontWeight: "bold",
        marginLeft: "auto",
        fontSize: 45,
    },
    menuButton: {
        position: 'absolute',
        top: 20,
        left: 5,
        width: 30,
        height: 30,
        zIndex: 10,
        padding: 10,
    },
    
    addButton: {
        position: 'absolute',
        top: 20,
        right: 5,
        zIndex: 30,
    },
    sidebar: {
        position: 'absolute',
        left: -0, // Começa fora da tela
        top: 0,
        width: 200,
        height: '100%',
        backgroundColor: '#4a2dbd',
        paddingVertical: 50,
        paddingHorizontal: 1,
        zIndex: 20, // Garante que a sidebar fique acima dos outros elementos
    },
    sidebarButton: {
        marginBottom: 35,
        flexDirection: 'row',
    },
    sidebarButtonExit: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
        left: 15
    },
    sidebarButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        marginLeft: 5,
        marginVertical: 'auto',
    },
    user: {
        marginTop: 35,
        marginBottom: 30,
        flexDirection: "row",
    },
    boxSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        paddingVertical: 10,
        marginTop: 45,
        width: width * 0.8,
        left: width * 0.1,
    },
    searchBar: {
        flex: 1,
        paddingHorizontal: 10,
    },
    closeButton: {
        flexDirection: 'row',
    },
    titulo: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
        textDecorationLine: "underline",
    },
    linha: {
        borderWidth: 1,
        borderColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
    },
});