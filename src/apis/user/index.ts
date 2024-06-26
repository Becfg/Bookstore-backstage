import { User } from '@/views/user/type'
import http from '..'

export async function getUser(data: { username: string; password: string }) {

  return new Promise((resolve, reject) => {
    http
      .post('/api/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function getUserList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/staff')
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function putUser(user: User) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/staff`, user)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function postUser(user: User) {
  console.log(user)

  return new Promise((resolve, reject) => {
    http
      .post(`/api/staff`, user)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteUser(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/staff/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
