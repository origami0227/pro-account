import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { http } from '../shared/Http'

//类型声明
type MeState = {
    me?: User
    mePromise?: Promise<AxiosResponse<Resource<User>>>
}
type MeActions = {
    refreshMe: () => void
    fetchMe: () => void
}
export const useMeStore = defineStore<string, MeState, {}, MeActions>('me', {
    //id用来区分各个store，所以id不能重名
    state: () => ({ //数据
        me: undefined,
        mePromise: undefined
    }),
    actions: { //对数据的操作
        refreshMe() {
            //this获取上面的state 要把箭头函数改为具名函数
            this.mePromise = http.get<Resource<User>>('/me')
        },
        fetchMe() {
            this.refreshMe()
        }
    }
})