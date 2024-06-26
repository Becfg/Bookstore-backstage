import { Job } from '@/views/user/type'
import http from '..'

export async function getJobList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/job', {
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

export async function postJob(form: Job) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/job', form, {
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

export async function deleteJob(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/job/${id}`, {
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
