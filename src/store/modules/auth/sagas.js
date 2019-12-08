import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';
import { signSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { id } = payload;

    yield call(api.get, `students/${id}`);

    yield put(signSuccess(id));
  } catch (err) {
    Alert.alert('Falha ao entrar no sistema', 'Aluno não cadastrado.');
    yield put(signFailure());
  }
}

export default all([takeLatest('@auth/SIGN_REQUEST', signIn)]);
