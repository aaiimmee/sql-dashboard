import { message } from 'antd';
import {
  getTables,
  getColumns,
  submitQuery,
  getHistoryQuery,
  saveQuery,
  getSavedSql,
  delSaved,
  updateQuery,
  AppProgress,
  AppResult,
  CancelJob,
} from '../../services/sql/sql';

export default {
  namespace: 'sql',
  state: {
    tables: [],
    columns: [],
    jobName: '',
    queryList: [],
    savedSql: [],
    progress: '',
    State: '',
    ResultList: [],
    titlearr:[],
  },
  effects: {
    *fetchTables({ payload }, { call, put }) {
      const response = yield call(getTables, payload);
      if (!response) return;
      if (response.code === 0) {
        yield put({
          type: 'saveTables',
          payload: response.data.info,
        });
      }
    },
    *fetchColumns({ payload }, { call, put }) {
      const response = yield call(getColumns, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveColumns',
          payload: response.data.info,
        });
      }
    },
    *runQuery({ payload }, { call, put }) {
      const response = yield call(submitQuery, payload);
      if (response.code === -2 || response.code === -1) {
        message.error(response.data.info);
      } else {
        yield put({
          type: 'fetchQueryHistory',
          payload: {
            userName: localStorage.getItem('userName'),
          },
        });
        yield put({
          type: 'savejobName',
          payload: response.data.jobName,
        });
      }
      return response;
    },
    *fetchQueryHistory({ payload }, { call, put }) {
      const response = yield call(getHistoryQuery, payload);
      yield put({
        type: 'addQueryHistory',
        payload: response.data.info,
      });
    },
    *saveQuery({ payload }, { call, put }) {
      const response = yield call(saveQuery, payload);
      if (response.code === 0) {
        message.success('保存成功');
        yield put({
          type: 'fetchSavedSql',
          payload: {
            userName: localStorage.getItem('userName'),
          },
        });
      }
    },
    *fetchSavedSql({ payload }, { call, put }) {
      const response = yield call(getSavedSql, payload);
      if (response.code === 0) {
        yield put({
          type: 'addSavedSql',
          payload: response.data.info,
        });
      }
    },
    *deleteSavedQuery({ payload }, { call, put }) {
      const response = yield call(delSaved, payload);
      if (response.code === 0) {
        message.success('删除成功~');
        yield put({
          type: 'deleteSaved',
          payload,
        });
      }
    },
    *updateSqlQuery({ payload }, { call, put }) {
      const response = yield call(updateQuery, payload);
      if (response.code === 0) {
        message.success('更新成功~');
        yield put({
          type: 'fetchSavedSql',
          payload: {
            userName: localStorage.getItem('userName'),
          },
        });
      }
    },
    *appProgress({ payload }, { call, put }) {
      const response = yield call(AppProgress, payload);
      if (response.data.state === 'FINISHED') {
        yield put({
          type: 'Result',
          payload: { jobName: payload.jobName },
        });
      }
      if (response.code === 0) {
        yield put({
          type: 'appProgressSuccess',
          payload: response.data,
        });
      }else{
        yield put({
          type:'cancelJob',
          payload: { jobName: payload.jobName },
        });
        message.error(response.data.info);
      }

      return response;
    },
    *Result({ payload }, { call, put }) {
      const response = yield call(AppResult, payload);
      if (response.code === 0) {
        yield put({
          type: 'ResultSuccess',
          payload: response.data.info,
        });
      }
    },
    *cancelJob({ payload }, { call}) {
      const response = yield call(CancelJob, payload);
      if (response.code === 1) {
       message.success(response.data.info);
      }
    },
  },
  reducers: {
    saveTables(state, { payload }) {
      return {
        ...state,
        tables: payload,
      };
    },
    saveColumns(state, { payload }) {
      return {
        ...state,
        columns: payload,
      };
    },
    savejobName(state, { payload }) {
      return {
        ...state,
        jobName: payload,
      };
    },
    addQueryHistory(state, { payload }) {
      return {
        ...state,
        queryList: payload,
      };
    },
    addSavedSql(state, { payload }) {
      return {
        ...state,
        savedSql: payload,
      };
    },
    deleteSaved(state, { payload }) {
      const { savedSql } = state;
      let arr = [];
      if (savedSql.length > 0) {
        arr = savedSql.filter(item => item.id !== payload.id);
      }
      return {
        ...state,
        savedSql: arr,
      };
    },
    appProgressSuccess(state, { payload }) {
      if(payload.state==='FINISHED'){
       payload.progress=100;
      }
      return {
        ...state,
        progress: payload.progress,
        State: payload.state,
      };
    },
    ResultSuccess(state, { payload }) {
     const titleArr= payload.shift();
     console.log(titleArr);
      const arr=[];
       payload.map((item)=>
       arr.push(item[0])
      );
       /* 把字符串中所有的空格用逗号代替 */
      // const reg = /\s+([^\s]*)/g;
      // const arr2= arr.map(item=>
      // item.replace(reg,",$1").split(',')
      // )
      const arr3=[];
      payload.map(item=>
          arr3.push({[titleArr[0]]:item[0],[titleArr[1]]:item[1],[titleArr[2]]:item[2],[titleArr[3]]:item[3],
            [titleArr[4]]:item[4],[titleArr[5]]:item[5],[titleArr[6]]:item[6],[titleArr[7]]:item[7],[titleArr[8]]:item[8],
            [titleArr[9]]:item[9],[titleArr[10]]:item[10],[titleArr[11]]:item[11],[titleArr[12]]:item[12],[titleArr[13]]:item[13],
          })
      )
      console.log(arr3);
      return {
        ...state,
        titlearr:titleArr,
        ResultList: arr3,
      };
    },
    clear(state) {
      return {
        ...state,
        State: '',
        progress:0,
      };
    },
  },
};
