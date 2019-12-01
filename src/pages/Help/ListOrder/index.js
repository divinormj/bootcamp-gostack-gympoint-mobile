import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

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
  const id = useSelector(state => state.auth.id);
  const [helps, setHelps] = useState([]);

  useEffect(() => {
    async function loadHelps() {
      const response = await api.get(`students/${id}/help_orders`);
      const data = response.data.map(item => ({
        ...item,
        time: formatRelative(parseISO(item.createdAt), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      setHelps(data);
    }

    loadHelps();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isFocused) {
      const add = navigation.getParam('addHelpOrder');

      if (add) {
        setHelps([...helps, add]);
      }
    }
  }, [isFocused]); // eslint-disable-line

  function handleNewHelp() {
    navigation.navigate('NewOrder');
  }

  function handleViewHelp(item) {
    navigation.navigate('Answer', { helpOrder: item });
  }

  return (
    <Container>
      <HelpButton onPress={handleNewHelp}>Novo pedido de auxilio</HelpButton>

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
