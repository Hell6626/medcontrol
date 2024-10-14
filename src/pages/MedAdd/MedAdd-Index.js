import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Modal, Button } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Notifications from 'expo-notifications';

// Configuração das permissões de notificação
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Esquema de validação com Yup
const validationSchema = Yup.object({
  produto: Yup.string().required("Nome do produto é obrigatório"),
  dose: Yup.number().required("Dose é obrigatória"),
  intervalo: Yup.number().required("Intervalo é obrigatório"),
  diasUso: Yup.number().required("Dias de uso são obrigatórios"),
  quantidadePorCaixa: Yup.number().required("Quantidade por caixa é obrigatória"),
  quantidadeCaixas: Yup.number().required("Quantidade de caixas é obrigatória"),
});

export default function MedAdd() {
  const navigation = useNavigation();
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const { userId, infoUserId } = route.params; // Pega o userId da navegação
  const baseURL = Platform.OS === 'android' ? 'http://192.168.0.188:3001' : 'http://localhost:3001';
  
  // Verifique se o userId está disponível
  console.log("User ID:", userId);

  // Função para agendar o alarme com repetição
  const scheduleAlarm = async (intervalInHours, durationInDays) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      const totalNotifications = Math.floor((24 / intervalInHours) * durationInDays);

      for (let i = 0; i < totalNotifications; i++) {
        const trigger = new Date();
        trigger.setHours(trigger.getHours() + intervalInHours * i);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Hora de tomar sua medicação!",
            body: "Não se esqueça de tomar a medicação agora.",
          },
          trigger,
        });
        console.log('Notificação agendada!', trigger);
      }
    } else {
      console.log("Permissão para notificações não concedida.");
    }
  };

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animatable.View animation="fadeInUpBig" style={styles.containerForm}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { userId: userId,infoUserId: infoUserId })}>
              <Icon name="close" size={40} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.message}>Medicamento</Text>
          </View>

          <Text style={styles.timeNumber}>{time.toLocaleTimeString()}</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.timeButton}>Selecionar horário da primeira dosagem</Text>
          </TouchableOpacity>

          <Formik
            initialValues={{
              produto: '',
              dose: '',
              intervalo: '',
              diasUso: '',
              quantidadePorCaixa: '',
              quantidadeCaixas: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => { // Inclua resetForm aqui
              console.log("Valores enviados:", values);
              
              try {
                const response = await fetch(`${baseURL}/medicamento`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    produto: values.produto,
                    dose: parseFloat(values.dose),
                    intervalo: parseInt(values.intervalo, 10),
                    diasUso: parseInt(values.diasUso, 10),
                    quantidadePorCaixa: parseInt(values.quantidadePorCaixa, 10),
                    quantidadeCaixas: parseInt(values.quantidadeCaixas, 10),
                    userId: infoUserId , // Certifique-se de que userId não é undefined
                    time: time.toLocaleTimeString(),
                  }),
                });
                
                if (response.ok) {
                  const data = await response.json();
                  console.log("Dados enviados com sucesso:", data);
                  
                  // Limpe os campos do formulário
                  resetForm(); // Chame resetForm aqui
                } else {
                  const errorData = await response.json();
                  console.log("Erro ao enviar dados:", response.statusText, errorData);
                }
              } catch (error) {
                console.error("Erro de rede:", error);
              }

              scheduleAlarm(values.intervalo, values.diasUso);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, resetForm }) => (
              <View>
                <TextInput
                  placeholder="Produto: (Nome)"
                  style={styles.timeText}
                  onChangeText={handleChange('produto')}
                  onBlur={handleBlur('produto')}
                  value={values.produto}
                />
                <ErrorMessage name="produto" component={Text} style={styles.errorText} />
                <Icon name="search" size={30} color="#000" style={styles.icon3} onPress={() => setModalVisible(true)} />

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Este é um Popup!</Text>
                      <Button
                        title="Fechar"
                        onPress={() => setModalVisible(false)}
                      />
                    </View>
                  </View>
                </Modal>

                <TextInput
                  placeholder="Dosagem: (Comprimido/Gotas)"
                  style={styles.timeText}
                  keyboardType="numeric"
                  onChangeText={handleChange('dose')}
                  onBlur={handleBlur('dose')}
                  value={values.dose}
                />
                <ErrorMessage name="dose" component={Text} style={styles.errorText} />

                <TextInput
                  placeholder="Intervalo entre dosagens: (Horas)"
                  style={styles.timeText}
                  keyboardType="numeric"
                  onChangeText={handleChange('intervalo')}
                  onBlur={handleBlur('intervalo')}
                  value={values.intervalo}
                />
                <ErrorMessage name="intervalo" component={Text} style={styles.errorText} />

                <TextInput
                  placeholder="Dias de uso:"
                  style={styles.timeText}
                  keyboardType="numeric"
                  onChangeText={handleChange('diasUso')}
                  onBlur={handleBlur('diasUso')}
                  value={values.diasUso}
                />
                <ErrorMessage name="diasUso" component={Text} style={styles.errorText} />

                <TextInput
                  placeholder="Quantidade por Caixa:"
                  style={styles.timeText}
                  keyboardType="numeric"
                  onChangeText={handleChange('quantidadePorCaixa')}
                  onBlur={handleBlur('quantidadePorCaixa')}
                  value={values.quantidadePorCaixa}
                />
                <ErrorMessage name="quantidadePorCaixa" component={Text} style={styles.errorText} />

                <TextInput
                  placeholder="Quantidade de Caixas:"
                  style={styles.timeText}
                  keyboardType="numeric"
                  onChangeText={handleChange('quantidadeCaixas')}
                  onBlur={handleBlur('quantidadeCaixas')}
                  value={values.quantidadeCaixas}
                />
                <ErrorMessage name="quantidadeCaixas" component={Text} style={styles.errorText} />

                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={styles.submitButton}>Adicionar Medicamento</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={styles.time}
            />
          )}
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
    useFetchData()
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#613CF0",
  },
  scrollView: {
    flexGrow: 1,
  },
  icon: {
    marginTop: 15,
    marginBottom: 15,
    position: "absolute",
  },
  icon3: {
    marginTop: 10,
    position: "absolute",
    right: 10
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
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  timeText: {
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: "auto",
    marginBottom: 10,
    width: '100%',
    fontSize: 18,
    color: "#333",
  },
  timeButton: {
    backgroundColor: "#613CF0",
    fontSize: 20,
    fontWeight: 'bold',
    color: "white",
    textAlign: 'center',
    borderBottomWidth: 1,
    borderRadius: 5,
    width: '90%',
    padding: 10,
    marginBottom: 40,
    margin: 'auto',
  },
  timeNumber: {
    margin: "auto",
    fontSize: 50,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#613CF0",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
