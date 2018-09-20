import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function login(params) {
  return request('/api/access/login', { method: 'POST', body: params });
}

