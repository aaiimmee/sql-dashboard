import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {
  fetchUser,
  removeUser,
  AddUser,
  TableControl,
  AllDatabase,
  AllTable,
  AddTableControl,
} from '../../services/sql/admin';

export default {
  namespace: 'admin',
  state: {
    UserList: [],
    TableList: [],
    DataBase: [],
    table: [],
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(fetchUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'querySuccess',
          payload: response.data.info,
        });
      }
    },
    *DelUser({ payload }, { call, put }) {
      const response = yield call(removeUser, payload);
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'removeSuccess',
          payload: {
            userName: payload.userName,
          },
        });
      }
    },
    *addUser({ payload }, { call, put }) {
      const response = yield call(AddUser, payload);
      if (response.code === 0) {
        message.success('添加用户成功');
        yield put({
          type: 'addSuccess',
          NewUser: payload,
        });
      }
    },
    *skipTableList({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/sql_table',
          search: stringify(payload),
        })
      );
    },
    *tableControl({ payload }, { call, put }) {
      const response = yield call(TableControl, payload);
      const table1 = Object.entries(response.data.info);
      const arr = [];
      table1.map(item => arr.push({ table: item[0], authorize: item[1] }));
      if (response.code === 0) {
        yield put({
          type: 'tableSuccess',
          payload: arr,
        });
      }
    },
    *fetchDatabase({ payload }, { call, put }) {
      const response = yield call(AllDatabase, payload);
      if (response.code === 0) {
        yield put({
          type: 'databaseSuccess',
          payload: response.data.info,
        });
      }
    },
    *allTable({ payload }, { call, put }) {
      const response = yield call(AllTable, payload);
      if (response.code === 0) {
        yield put({
          type: 'databaseTableSuccess',
          payload: response.data.info,
        });
      }
    },
    *addTableControl({ payload }, { call }) {
      const response = yield call(AddTableControl, payload);
      if (response.code === 0) {
        message.success('权限提交成功！');
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return {
        ...state,
        UserList: payload,
      };
    },
    removeSuccess(state, { payload }) {
      const List = state.UserList.filter(item => {
        return item.userName !== payload.userName;
      });
      return {
        ...state,
        UserList: List,
      };
    },
    addSuccess(state, { NewUser }) {
      state.UserList.push(NewUser);
      return {
        ...state,
      };
    },
    tableSuccess(state, { payload }) {
      return {
        ...state,
        TableList: payload,
      };
    },
    databaseSuccess(state, { payload }) {
      return {
        ...state,
        DataBase: payload,
      };
    },

    /* 根据库名获取表 */
    databaseTableSuccess(state, { payload }) {
      return {
        ...state,
        table: payload,
      };
    },
    DelData(state, { payload }) {
      const List = state.TableList.filter(item => {
        return item !== payload;
      });
      return {
        ...state,
        TableList: List,
      };
    },
    AddData(state, { payload }) {
      state.TableList.push(payload);
      return {
        ...state,
      };
    },
    replaceAuthorize(state, { payload }) {
      // eslint-disable-next-line
      state.TableList.map(item => {
        if (item.table === payload.table) {
          item.authorize = payload.authorize;
        }
      });
      return {
        ...state,
      };
    },
  },
};
