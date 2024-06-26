import { Book } from '@/views/book/type'
import http from '../'

export async function getBookList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/book', {
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

export async function postBook(form: Book) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/book', form, {
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

export async function putBook(user: Book) {
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
