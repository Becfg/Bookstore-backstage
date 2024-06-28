import http from '..'
import { DailyCounting } from '@/views/business/type'

export async function getDailyCountingList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/dailyCounting', {
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

export async function postDailyCounting(form: DailyCounting) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/dailyCounting', form, {
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

export async function putDailyCounting(form: DailyCounting) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/dailyCounting`, form)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteDailyCounting(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/dailyCounting/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
