import http from '..'
import { MonthlyCounting } from '@/views/business/type'

export async function getMonthlyCountingList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/monthlyCounting', {
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

export async function postMonthlyCounting(form: MonthlyCounting) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/monthlyCounting', form, {
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

export async function putMonthlyCounting(form: MonthlyCounting) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/monthlyCounting`, form)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteMonthlyCounting(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/monthlyCounting/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
