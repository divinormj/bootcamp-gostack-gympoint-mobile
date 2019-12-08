import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { signOut } from '~/store/modules/auth/actions';
import api from '~/services/api';

import LogoHeader from '~/components/LogoHeader';
import {
  Container,
  HelpButton,
  List,
  ListItem,
  Info,
  Status,
  StatusIcon,
  StatusText,
  Time,
  Question,
} from './styles';

function ListOrder({ navigation, isFocused }) {
  const dispatch = useDispatch();
  const id = useSelector(state => state.auth.id);
  const [loading, setLoading] = useState(true);
  const [helps, setHelps] = useState([]);

  async function loadHelps() {
    try {
      const response = await api.get(`students/${id}/help_orders`);
      const data = response.data.map(item => ({
        ...item,
        time: formatRelative(parseISO(item.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      setHelps(data);
    } catch (err) {
      if (err.response.status === 402) {
        Alert.alert(
          'Acesso negado',
          'Aluno não cadastrado, faça um novo login.'
        );
        dispatch(signOut());
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused && loading) {
      loadHelps();
    }
  }, [isFocused]); // eslint-disable-line

  function handleNewHelp() {
    navigation.navigate('NewOrder', { setLoading });
  }

  function handleViewHelp(item) {
    navigation.navigate('Answer', { helpOrder: item });
  }

  return (
    <Container>
      <HelpButton onPress={handleNewHelp} loading={loading}>
        Novo pedido de auxilio
      </HelpButton>

      <List
        data={helps}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ListItem onPress={() => handleViewHelp(item)}>
            <Info>
              <Status>
                <StatusIcon
                  name="check-circle"
                  size={20}
                  answered={item.answer}
                />
                <StatusText answered={item.answer}>
                  {item.answer ? 'Respondido' : 'Sem resposta'}
                </StatusText>
              </Status>
              <Time>{item.time}</Time>
            </Info>
            <Question numberOfLines={3}>{item.question}</Question>
          </ListItem>
        )}
      />
    </Container>
  );
}

ListOrder.navigationOptions = {
  headerTitle: () => <LogoHeader />,
};

export default withNavigationFocus(ListOrder);
