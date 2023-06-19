import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export const preProcessBatch = file => api.post(`/preProcessBatch`, file)

const apis = {
    preProcessBatch,
}

export default apis