import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Button from '~/components/Button';
import LogoHeader from '~/components/LogoHeader';
import { Container, QuestionText } from './styles';

export default function NewOrder({ navigation }) {
  const id = useSelector(state => state.auth.id);
  const [question, setQuestion] = useState('');

  async function handleNewOrder() {
    try {
      await api.post('students/help_orders', {
        student_id: id,
        question,
      });

      const setLoading = navigation.getParam('setLoading');
      setLoading(true);

      navigation.navigate('ListOrder');
    } catch (err) {
      if (err.response.status === 401) {
        Alert.alert('Informe a sua pergunta.');
      } else if (err.response.status === 402) {
        Alert.alert('Aluno não cadastrado.');
      } else {
        Alert.alert('Falha ao gravar.', 'Por favor tente novamente.');
      }
    }
  }

  return (
    <Container>
      <QuestionText
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        placeholder="Inclua seu pedido de auxílio"
        value={question}
        onChangeText={setQuestion}
      />
      <Button onPress={handleNewOrder}>Enviar pedido</Button>
    </Container>
  );
}

NewOrder.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <LogoHeader />,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Icon name="chevron-left" size={24} color="#000" />
    </TouchableOpacity>
  ),
});
