import {faker} from '@faker-js/faker'
import {AxiosRequestConfig} from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

faker.setLocale('zh_CN');

export const mockItemCreate: Mock = config => {
    return [200, {
        resource: {
            "id": 2264,
            "user_id": 1312,
            "amount": 9900,
            "note": null,
            "tags_id": [3508],
            "happen_at": "2020-10-29T16:00:00.000Z",
            "created_at": "2022-07-03T15:35:56.301Z",
            "updated_at": "2022-07-03T15:35:56.301Z",
            "kind": "expenses"
        }
    }]
}

export const mockSession: Mock = (config) => {
    return [200, {
        jwt: faker.random.word()
    }]
}
//id放外面使其成为全局变量
let id = 0 //id初始为0
const createId = () => {
    id += 1 //id自增
    return id
}
export const mockTagIndex: Mock = (config) => {
    const {kind, page} = config.params //析构赋值
    // 声明两个常量便于封装
    const per_page = 25
    const count = 26
    //封装创建pager函数，返回这三个字段
    const createPaper = (page = 1) => ({
        page,
        per_page,
        count,
    })
    //createBody，直接把body都放在一起
    const createBody = (n = 1, attrs?: any) => ({
        resources: createTag(n), pager: createPaper(page)
    })
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

    if (kind === 'expenses' && (!page || page === 1)) {
        return [200, createBody(25)]
        //     {
        //     resources: createTag(),//随机生成12个tag
        //     pager: {
        //         page: 1, //当前页码是1
        //         per_page,
        //         count,
        //     }
        // }
    } else if (kind === 'expenses' && page === 2) {
        return [200, createBody(1)]
    } else if (kind === 'income' && (!page || page === 1)) {
        return [200, createBody(25)]
    } else {
        return [200, createBody(1)]
    }
}
