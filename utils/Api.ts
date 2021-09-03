import _ from 'lodash';
import axios from 'axios'

const execute = async (url: string, method = 'GET', { params = {}, queries = {}, payloads = {}, headers = {} } = {}) => {
    const base = url.replace(/\/$/, '');
    const api_url = url
    const options: any = { method, headers };

    if (method === 'POST' || method === 'PATCH') {
        options.data = JSON.stringify(payloads);
    }

    if (queries) {
        options.params = queries;
    }

    options.url = api_url;
    options.baseURL = base;
    console.log("Request", options)
    return await axios(options);
};

const getdineindata = async (url: string) => {
    return await (await axios.post(url, ["diningarea", "diningtable"])).data
}

export default {
    get: (url: string, options: { params?: {} | undefined; queries?: {} | undefined; payloads?: {} | undefined; headers?: {} | undefined; } | undefined) => execute(url, 'GET', options),
    post: (url: string, options: { params?: {} | undefined; queries?: {} | undefined; payloads?: {} | undefined; headers?: {} | undefined; } | undefined) => execute(url, 'POST', options),
    patch: (url: string, options: { params?: {} | undefined; queries?: {} | undefined; payloads?: {} | undefined; headers?: {} | undefined; } | undefined) => execute(url, 'PATCH', options),
    delete: (url: string, options: { params?: {} | undefined; queries?: {} | undefined; payloads?: {} | undefined; headers?: {} | undefined; } | undefined) => execute(url, 'DELETE', options),
    getdineindata: (url: string) => getdineindata(url),
};