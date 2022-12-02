import { defineStore } from 'pinia'
import { http } from '../shared/Http'

type State = {
    items: Item[]
    hasMore: boolean
    page: number
}
type Actions = {
    reset: () => void
    fetchItems: (startDate?: string, endDate?: string) => void
}
export const useItemStore = (id: string | string[]) =>
    defineStore<string, State, {}, Actions>(typeof id === 'string' ? id : id.join('-'), {
        state: () => ({
            items: [], //记账事件默认是一个空数组，记录是否含有items
            hasMore: false, //默认没有hasMore
            page: 0  //page默认从0开始
        }),
        actions: {
            reset() {
                //初始化方法
                this.items = []
                this.hasMore = false
                this.page = 0
            },
            //传来startDate，endDate
            async fetchItems(startDate, endDate) {
                //条件判断，如果不存在起始和终止时间就直接返回
                if (!startDate || !endDate) {
                    return
                }
                const response = await http.get<Resources<Item>>(
                    '/items',
                    {
                        happen_after: startDate, //起始事件
                        happen_before: endDate, //结束事件
                        page: this.page + 1
                    },
                    {
                        _mock: 'itemIndex', //mock数据
                        _autoLoading: true,//加载中
                    }
                )
                //析构赋值拿到resources和pager
                const { resources, pager } = response.data
                this.items?.push(...resources) //放入items里面
                //计算下一页的方法
                this.hasMore = (pager.page - 1) * pager.per_page + resources.length < pager.count
                this.page += 1
            }
        }
    })()