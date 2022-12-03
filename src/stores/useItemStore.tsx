import {defineStore} from 'pinia'
import {http} from '../shared/Http'

type State = {
    items: Item[]
    hasMore: boolean
    page: number
}
type Actions = {
    _fetch: (firstPage: boolean, startDate?: string, endDate?: string) => void
    fetchItems: (startDate?: string, endDate?: string) => void
    fetchNextPage: (startDate?: string, endDate?: string) => void
}

export const useItemStore = (id: string | string[]) =>
    defineStore<string, State, {}, Actions>(typeof id === 'string' ? id : id.join('-'), {
        state: () => ({
            items: [], //记账事件默认是一个空数组，记录是否含有items
            hasMore: false, //默认没有hasMore
            page: 0  //page默认从0开始
        }),
        actions: {

            //传来startDate，endDate
            //封装fetch
            async _fetch(firstPage, startDate, endDate) {
                //条件判断，如果不存在起始和终止时间就直接返回
                if (!startDate || !endDate) {
                    return
                }
                const response = await http.get<Resources<Item>>(
                    '/items',
                    {
                        happen_after: startDate, //起始事件
                        happen_before: endDate, //结束事件
                        page: firstPage ? 1 : this.page + 1 //页码判断
                    },
                    {
                        _mock: 'itemIndex', //mock数据
                        _autoLoading: true,//加载中
                    }
                )
                //析构赋值拿到resources和pager
                const {resources, pager} = response.data
                //页码判断进行
                if (firstPage) {
                    this.items = resources //覆盖旧第一页数据
                } else {
                    this.items.push(...resources)
                }
                //计算下一页的方法
                this.hasMore = (pager.page - 1) * pager.per_page + resources.length < pager.count
                this.page += 1
            },
            async fetchNextPage(startDate, endDate) {
                this._fetch(false, startDate, endDate) //请求下一页
            },
            async fetchItems(startDate, endDate) {
                this._fetch(true, startDate, endDate) //仅仅请求第一页
            }
        }
    })()