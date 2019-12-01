import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

import api from '~/services/api';

import Button from '~/components/Button';
import LogoHeader from '~/components/LogoHeader';
import { Container, QuestionText } from './styles';

export default function NewOrder({ navigation }) {
  const id = useSelector(state => state.auth.id);
  const [question, setQuestion] = useState('');

  async function handleNewOrder() {
    try {
      const response = await api.post('students/help_orders', {
        student_id: id,
        question,
      });

      navigation.navigate('ListOrder', { addHelpOrder: response.data });
    } catch (err) {
      if (err.message.indexOf('401') > 0) {
        Alert.alert('Informe a sua pergunta.');
      } else if (err.message.indexOf('402') > 0) {
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
        numberOfLines={10}
        textAlignVertical="top"
        placeholder="Inclua seu pedido de auxílio"
        value={question}
        onChangeText={setQuestion}
      />
      <Button onPress={handleNewOrder}>Enviar pedido</Button>
    </Container>
  );
}

NewOrder.navigationOptions = {
  headerTitle: () => <LogoHeader />,
};
