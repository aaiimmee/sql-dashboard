import request from '../../utils/request';

export async function login(params) {
  return request('/api/access/login', { method: 'POST', body: params });
}
export async function getTables(params) {
  return request('/api/table/userTable', {
    method: 'POST',
    body: params,
  });
}
export async function getColumns(params) {
  return request('/api/table/column', {
    method: 'POST',
    body: params,
  });
}
export async function submitQuery(params) {
  return request('/api/query/submitQuery', {
    method: 'POST',
    body: params,
  });
}
export async function getHistoryQuery(params) {
  return request('/api/query/history', {
    method: 'POST',
    body: params,
  });
}
export async function saveQuery(params) {
  return request('/api/query/saveSql', {
    method: 'POST',
    body: params,
  });
}
export async function getSavedSql(params) {
  return request('/api/query/savedSql', {
    method: 'POST',
    body: params,
  });
}
export async function delSaved(params) {
  return request('/api/query/deleteSavedSql', {
    method: 'POST',
    body: params,
  });
}
export async function updateQuery(params) {
  return request('/api/query/updateSavedSql', {
    method: 'POST',
    body: params,
  });
}
export async function AppProgress(params) {
  return request('/api/apps/appProgress', {
    method: 'POST',
    body: params,
  });
}
export async function AppResult(params) {
  return request('/api/apps/result', {
    method: 'POST',
    body: params,
  });
}
export async function CancelJob(params) {
  return request('/api/apps/cancelJob', {
    method: 'POST',
    body: params,
  });
}
