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
    let id = 0 //id初始为0
    const createId = () => {
        id += 1 //id自增
        return id
    }
    const createTag = (n = 1, attrs?: any) =>
        //声明一个长度为length的数组，
        //然后去map他，map的过程中返回这个包含id，name等内容的对象
        Array.from({length: n}).map(() => (
            {
                id: createId(),
                name: faker.lorem.word(),//随机文字
                sign: faker.internet.emoji(),//emoji
                kind: config.params.kind,//从config里面拿到kind
                ...attrs //覆盖
            }
        ))

    if (config.params.kind === 'expenses') {
        return [200, {
            resources: createTag(12)//随机生成12个tag
        }]
    } else {
        return [200, {
            resources: createTag(12)
        }]
    }
}