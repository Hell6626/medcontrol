
import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, TouchableOpacity, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Animatable from "react-native-animatable";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile({ navigation }) {
  const navigation2 = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [location, setLocation] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Função para solicitar permissão de acesso à galeria
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão negada", "Precisamos de acesso à sua galeria para continuar.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Função para salvar as informações
  const handleSave = () => {
    const userProfile = {
      name,
      email,
      phone,
      pronouns,
      location,
      height,
      weight,
      profileImage,
    };

    Alert.alert("Informações Salvas", "Seu perfil foi atualizado com sucesso!");

    console.log(userProfile); // Aqui, você pode enviar o userProfile para um servidor, API, etc.
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>

        <View style={styles.container}>
          <Animatable.View animation="fadeInUpBig" style={styles.containerForm}>
            <View>
              <TouchableOpacity
                onPress={() => navigation2.navigate('Home')}>
                <Icon name="chevron-left" size={35} color="black" style={styles.icon3} />
              </TouchableOpacity>
              <Text style={styles.message} >Perfil</Text>
            </View>

            <View style={styles.profile}>
              <View style={styles.image}>
                {profileImage && (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                )}
                <Icon
                  name="edit"
                  size={20}
                  color="black"
                  style={styles.icon2}
                  onPress={pickImage}
                />
              </View>
              <TextInput
                placeholder="Nome"
                style={styles.name}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.config}>
              <Icon name="mail" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Email</Text>
                <TextInput
                  placeholder="Seu Email"
                  style={styles.textoinsere}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.config}>
              <Icon name="phone" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Telefone</Text>
                <TextInput
                  placeholder="Seu Telefone"
                  style={styles.textoinsere}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={styles.config}>
              <Icon name="user-check" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Pronomes</Text>
                <TextInput
                  placeholder="Não Especificar"
                  style={styles.textoinsere}
                  value={pronouns}
                  onChangeText={setPronouns}
                />
              </View>
            </View>

            <View style={styles.config}>
              <Icon name="map-pin" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Local</Text>
                <TextInput
                  placeholder="Local de Residência"
                  style={styles.textoinsere}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Adicionar Altura */}
            <View style={styles.config}>
              <Icon name="bar-chart-2" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Altura (cm)</Text>
                <TextInput
                  placeholder="Sua altura"
                  keyboardType="numeric"
                  style={styles.textoinsere}
                  value={height}
                  onChangeText={setHeight}
                />
              </View>
            </View>

            {/* Adicionar Peso */}
            <View style={styles.config}>
              <Icon name="trending-up" size={33} color="black" style={styles.icon} />
              <View>
                <Text style={styles.texto}>Peso (kg)</Text>
                <TextInput
                  placeholder="Seu peso"
                  keyboardType="numeric"
                  style={styles.textoinsere}
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>

            {/* Botão de Salvar */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar Informações</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#613CF0',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  containerheader: {
    width: 35,
    height: 35,
    marginTop: 15,
    marginBottom: 15,
    position: 'absolute',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 28,
    fontWeight: "bold",
    margin: "auto",
  },
  containerForm: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  profile: {
    marginTop: 15,
    alignItems: 'center',
  },
  icon2: {
    position: 'absolute',
    end: -10,
    bottom: 0,
  },
  icon3: {
    marginTop: 15,
    marginBottom: 15,
    position: "absolute",
  },
  image: {
    width: 152,
    height: 152,
    borderRadius: 76,
    marginBottom: 20,
    borderWidth: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
  },
  texto: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  textoinsere: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  config: {
    flexDirection: 'row',
    marginTop: 25,
  },
  saveButton: {
    backgroundColor: '#613CF0',
    borderRadius: 10,
    padding: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});