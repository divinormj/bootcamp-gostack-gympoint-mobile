import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import LogoHeader from '~/components/LogoHeader';
import { Container, CheckinButton, List, ListItem, Seq, Time } from './styles';

export default function Checkin() {
  const id = useSelector(state => state.auth.id);
  const [checkins, setCheckins] = useState([]);

  async function loadCheckins() {
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
      if (err.message.indexOf('402') > 0) {
        Alert.alert(
          'Acesso bloqueado!',
          'São permitidos no máximo 5 acessos a cada 7 dias.'
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
      <CheckinButton onPress={handleCheckin}>Novo check-in</CheckinButton>
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
