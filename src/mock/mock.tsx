import {faker} from '@faker-js/faker'
import {AxiosRequestConfig} from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');


export const mockSession: Mock = (config) => {
    return [200, {
        jwt: faker.random.word()
    }]
}

export const mockTagIndex: Mock = (config) => {
    if (config.params.kind === 'expenses') {
        return [200, {
            resources: [
                {id: 1, name: '餐饮', sign: '￥', find: 'expenses'},
                {id: 2, name: '打车', sign: '￥', find: 'expenses'},
                {id: 3, name: '地铁', sign: '￥', find: 'expenses'},
                {id: 4, name: '公交', sign: '￥', find: 'expenses'},
                {id: 5, name: '房租', sign: '￥', find: 'expenses'},
                {id: 6, name: '游玩', sign: '￥', find: 'expenses'},
                {id: 7, name: '聚餐', sign: '￥', find: 'expenses'},
                {id: 8, name: '购物', sign: '￥', find: 'expenses'},
                {id: 9, name: '生活', sign: '￥', find: 'expenses'},
                {id: 10, name: '公益', sign: '￥', find: 'expenses'},
                {id: 11, name: '保险', sign: '￥', find: 'expenses'},
                {id: 12, name: '医疗', sign: '￥', find: 'expenses'},
                {id: 13, name: '宠物', sign: '￥', find: 'expenses'},
                {id: 14, name: '还款', sign: '￥', find: 'expenses'},
                {id: 15, name: '游戏', sign: '￥', find: 'expenses'},
            ]
        }]
    } else {
        return [200, {
            resources: [
                {id: 16, name: '工资', sign: '￥', find: 'income'},
                {id: 17, name: '彩票', sign: '￥', find: 'income'},
                {id: 18, name: '基金', sign: '￥', find: 'income'},
                {id: 19, name: '债券', sign: '￥', find: 'income'},
                {id: 20, name: '定期', sign: '￥', find: 'income'},
                {id: 21, name: '外汇', sign: '￥', find: 'income'},
                {id: 22, name: '股票', sign: '￥', find: 'income'},
                {id: 23, name: '贵金属', sign: '￥', find: 'income'},
                {id: 24, name: '虚拟货币', sign: '￥', find: 'income'},
                {id: 25, name: '转账', sign: '￥', find: 'income'},
                {id: 26, name: '红包', sign: '￥', find: 'income'},
            ]
        }]
    }
}