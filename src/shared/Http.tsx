import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { mockSession } from "../mock/mock";

type GetConfig = Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>
type PostConfig = Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>
type PatchConfig = Omit<AxiosRequestConfig, 'url' | 'data'>
type DeleteConfig = Omit<AxiosRequestConfig, 'params'>
//提前四个api的config

export class Http {
    instance: AxiosInstance
    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL
        })
    }
    get<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: GetConfig) {
        return this.instance.request<R>({ ...config, url: url, params: query, method: 'get' })
    }
    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
        return this.instance.request<R>({ ...config, url, data, method: 'post' })
    }
    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
        return this.instance.request<R>({ ...config, url, data, method: 'patch' })
    }
    delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
        return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
    }
}
//mock函数
const mock = (response: AxiosResponse) => {
    //先对地址进行检查，如果是这三个地址就进行篡改
    if (location.hostname !== 'localhost'
        && location.hostname !== '127.0.0.1' //这三个地址是开发的本地地址
        && location.hostname !== '192.168.3.57') { return false }//如果不是这个三个地址就return false 也就是不能更改
    switch (response.config?.params?._mock) {//看请求参数是否含有_mock,有mock就根据mock字符串找到对应的函数
        case 'session':
            [response.status, response.data] = mockSession(response.config)
            return true
    }
    return false
}

export const http = new Http('/api/v1')

http.instance.interceptors.request.use(config => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
        config.headers!.Authorization = `Bearer ${jwt}`
    }
    return config
})

http.instance.interceptors.response.use((response) => {
    mock(response)//如果response成功了就会尝试mock它（对response的篡改）
    return response
}, (error) => {
    if (mock(error.response)) {//如果可以篡改response的失败
        return error.response//就把这个response返回 当作没有error
    } else {
        throw error //如果篡改不了就返回这个error
    }
})
//拦截器可以不止一个
http.instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 429) {
                alert('你太频繁了')//公共报错处理
            }
        }
        throw error
    }
)