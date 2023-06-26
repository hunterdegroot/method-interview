import axios from 'axios'
const { REACT_APP_API_URL } = process.env;

export const parseBatch = file => {
    const formData = new FormData();
    formData.append("file", file);
    return axios({
        method: "post",
        url: `${REACT_APP_API_URL}/batch/parse`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
}

export const queBatch = file => {
    const formData = new FormData();
    formData.append("file", file);
    return axios({
        method: "post",
        url: `${REACT_APP_API_URL}/batch/que`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
}

const apis = {
    parseBatch, queBatch
}

export default apis