import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {
    mockItemCreate,
    mockItemIndex,
    mockItemIndexBalance, mockItemSummary,
    mockSession,
    mockTagEdit,
    mockTagIndex,
    mockTagShow
} from "../mock/mock";
import {Toast} from "vant";

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
        return this.instance.request<R>({...config, url: url, params: query, method: 'get'})
    }

    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
        return this.instance.request<R>({...config, url, data, method: 'post'})
    }

    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
        return this.instance.request<R>({...config, url, data, method: 'patch'})
    }

    delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
        return this.instance.request<R>({...config, url: url, params: query, method: 'delete'})
    }
}

//mock函数
const mock = (response: AxiosResponse) => {
    //先对地址进行检查，如果是这三个地址就进行篡改
    if (true || location.hostname !== 'localhost'
        && location.hostname !== '127.0.0.1' //这三个地址是开发的本地地址
        && location.hostname !== '192.168.3.57') {
        return false
    }//如果不是这个三个地址就return false 也就是不能更改
    switch (response.config?._mock) {//看请求参数是否含有_mock,有mock就根据mock字符串找到对应的函数
        case 'tagIndex':
            [response.status, response.data] = mockTagIndex(response.config)
            return true
        case 'session':
            [response.status, response.data] = mockSession(response.config)
            return true
        case 'itemCreate':
            [response.status, response.data] = mockItemCreate(response.config)
            return true
        case 'tagShow':
            [response.status, response.data] = mockTagShow(response.config)
            return true
        case 'tagEdit':
            [response.status, response.data] = mockTagEdit(response.config)
            return true
        case 'itemIndex':
            [response.status, response.data] = mockItemIndex(response.config)
            return true
        case 'itemIndexBalance':
            [response.status, response.data] = mockItemIndexBalance(response.config)
            return true
        case 'itemSummary':
            [response.status, response.data] = mockItemSummary(response.config)
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
    //希望自动展示loading
    if (config._autoLoading === true) {
        Toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
        });
    }
    return config
})
http.instance.interceptors.response.use((response) => {
    if (response.config._autoLoading === true) {
        //取消自动loading的拦截器
        Toast.clear();
    }
    return response
}, (error: AxiosError) => {
    if (error.response?.config._autoLoading === true) {
        Toast.clear();
    }
    throw error
})

http.instance.interceptors.response.use((response) => {
    mock(response)
    if (response.status >= 400) {
        throw {response}
    } else {
        return response
    }
}, (error) => {
    mock(error.response)
    if (error.response.status >= 400) {
        throw error
    } else {
        return error.response
    }
})
//拦截器可以不止一个
http.instance.interceptors.response.use(
    response => {
        return response
    },
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