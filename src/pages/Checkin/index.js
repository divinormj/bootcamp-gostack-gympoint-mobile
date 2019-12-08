import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { signOut } from '~/store/modules/auth/actions';
import api from '~/services/api';

import LogoHeader from '~/components/LogoHeader';
import { Container, CheckinButton, List, ListItem, Seq, Time } from './styles';

export default function Checkin() {
  const dispatch = useDispatch();
  const id = useSelector(state => state.auth.id);
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState([]);

  async function loadCheckins() {
    try {
      const response = await api.get(`students/${id}/checkins`);
      const data = response.data.map((check, index, array) => ({
        ...check,
        seq: array.length - index,
        time: formatRelative(parseISO(check.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      setCheckins(data);
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
    loadCheckins();
  }, []); // eslint-disable-line

  async function handleCheckin() {
    try {
      const response = await api.post(`students/${id}/checkins`);
      const data = {
        ...response.data,
        seq: checkins.length + 1,
        time: formatRelative(parseISO(response.data.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      };

      setCheckins([data, ...checkins]);
    } catch (err) {
      if (err.response.status === 402) {
        Alert.alert(
          'Acesso negado',
          'Aluno não cadastrado, faça um novo login.'
        );
        dispatch(signOut());
      } else if (err.response.status === 403) {
        Alert.alert('Acesso bloqueado!', 'Aluno não possui matrícula ativa.');
      } else if (err.response.status === 404) {
        Alert.alert(
          'Acesso bloqueado!',
          'São permitidos no máximo 5 acessos por semana.'
        );
      } else {
        Alert.alert(
          'Falha ao realizar check-in.',
          'Por favor tente novamente.'
        );
      }
    }
  }

  return (
    <Container>
      <CheckinButton onPress={handleCheckin} loading={loading}>
        Novo check-in
      </CheckinButton>
      <List
        data={checkins}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ListItem>
            <Seq>Check-in #{item.seq}</Seq>
            <Time>{item.time}</Time>
          </ListItem>
        )}
      />
    </Container>
  );
}

Checkin.navigationOptions = {
  headerTitle: () => <LogoHeader />,
};
