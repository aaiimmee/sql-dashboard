import { stringify } from 'qs';
import request from '../../utils/request';

export async function fetchUser(params) {
  return request(`/api/access/allUser?${stringify(params)}`);
}
export async function removeUser(params) {
  return request(`/api/access/deleteUser`, {
    method: 'POST',
    body: params,
  });
}
export async function AddUser(params) {
  return request(`/api/access/addUser`, {
    method: 'POST',
    body: params,
  });
}
export async function TableControl(params) {
  return request(`/api/access/tableControl`, {
    method: 'POST',
    body: params,
  });
}
export async function AllDatabase(params) {
  return request(`/api/table/allDatabase?${stringify(params)}`);
}
export async function AllTable(params) {
  return request(`/api/table/allTable`, {
    method: 'POST',
    body: params,
  });
}
export async function AddTableControl(params) {
  return request(`/api/access/addTableControl`, {
    method: 'POST',
    body: params,
  });
}
