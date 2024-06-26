import http from '../'
import { Sale } from '@/views/business/type'

export async function getSaleList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/sale', {
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

export async function getSaleDetailRefer(id: number) {
  return new Promise((resolve, reject) => {
    http
      .get(`/api/saleDetailRefer/${id}`, {
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

export async function postSale(form: Sale) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/sale', form, {
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

export async function putSale(user: Sale) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/book`, user)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteBook(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/book/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
