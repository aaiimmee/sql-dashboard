import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { login } from '../services/sql/sql';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';


export default {
  namespace: 'login',

  state: {
    status: undefined,
    role:'',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            role:response.data.role,
            currentAuthority: 'admin',
            userName: payload.userName,
            token: response.data.token,
          },
        });
        reloadAuthorized()
        yield put(
          routerRedux.push('/')
        );
      } else if(response.code === -1){
        message.error(response.data.info)
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          userName: '',
          token: '',
          role:'',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      localStorage.setItem('userName', payload.userName)
      localStorage.setItem('token', `token=${payload.token}`)
      localStorage.setItem('role',payload.role);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
