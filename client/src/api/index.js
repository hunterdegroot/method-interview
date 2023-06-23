import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export const stageBatch = file => {
    const formData = new FormData();
    formData.append("file", file);

    return axios({
        method: "post",
        url: "http://localhost:5000/api/batch/stage",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
    // return api.post(`/batch/stage`, {
    //     data: formData,
    //     headers: { "Content-Type": "multipart/form-data" },
    // })
}

export const queBatches = batchIds => api.post(`/batch/que`, { batchIds })

const apis = {
    stageBatch, queBatches
}

export default apis