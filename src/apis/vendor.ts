import { Book } from '@/views/book/type'
import http from '.'

export async function getVendorList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/vendor', {
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

export async function postVendor(form: Book) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/vendor', form, {
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

export async function putVendor(user: Book) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/vendor`, user)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteVendor(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/vendor/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
