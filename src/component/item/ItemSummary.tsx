import {defineComponent, onMounted, PropType, reactive, ref, watch} from 'vue';
import {FloatButton} from '../../shared/FloatButton';
import s from './ItemSummary.module.scss';
import {http} from "../../shared/Http";
import {Money} from "../../shared/Money";
import {Button} from '../../shared/Button'
import {Datetime} from "../../shared/Datetime";

export const ItemSummary = defineComponent({
    props: {
        startDate: {
            type: String as PropType<string>,
            required: false
        },
        endDate: {
            type: String as PropType<string>,
            required: false
        }
    },
    setup: (props, context) => {
        const items = ref<Item[]>([]) //记账事件默认是一个空数组，记录是否含有items
        const hasMore = ref(false) //默认没有hasMore
        const page = ref(0) //page默认从0开始
        const fetchItems = async () => {
            //条件判断，如果不存在起始和终止时间就直接返回
            if (!props.startDate || !props.endDate) {
                return
            }
            //get获取信息
            const response = await http.get<Resources<Item>>('/items', {
                happen_after: props.startDate,//起始事件
                happen_before: props.endDate, //结束事件
                page: page.value + 1,
            },{
                _mock: 'itemIndex', //mock数据
                _autoLoading: true,//加载中
            })
            //析构赋值拿到resources和pager
            const {resources, pager} = response.data
            //放入items里面
            items.value?.push(...resources)
            //计算下一页的方法
            hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
            page.value += 1
        }
        onMounted(fetchItems)//挂载时发送请求

        //watch中第一个参数是函数，返回要watch的对象，第二个参数一样是函数，返回要做的事件。
        watch(() => [props.startDate, props.endDate], async () => {
            //初始化
            items.value = []
            hasMore.value = false
            page.value = 0
            await fetchItems()
        })
        const itemsBalance = reactive({
            expenses: 0, income: 0, balance: 0
        })
        const fetchItemsBalance = async () => {
            //日期判断
            if (!props.startDate || !props.endDate) {
                return
            }
            //发送请求
            const response = await http.get('/items/balance', {
                happen_after: props.startDate,
                happen_before: props.endDate,
                page: page.value + 1,
            },{
                _mock: 'itemIndexBalance',
            })
            Object.assign(itemsBalance, response.data)
        }
        onMounted(fetchItemsBalance)
        watch(() => [props.startDate, props.endDate], async () => {
            Object.assign(itemsBalance, {
                expenses: 0, income: 0, balance: 0
            })
            await fetchItemsBalance()
        })
        return () => (
            <div class={s.wrapper}>
                {items.value ? (
                    <>
                        <ul class={s.total}>
                            <li>
                                <span>收入</span>
                                <Money value={itemsBalance.income}/>
                            </li>
                            <li>
                                <span>支出</span>
                                <Money value={itemsBalance.expenses}/>
                            </li>
                            <li>
                                <span>净收入</span>
                                <Money value={itemsBalance.balance}/>
                            </li>
                        </ul>
                        <ol class={s.list}>
                            {items.value.map((item) => (
                                <li>
                                    <div class={s.sign}>
                                        <span>{item.tags![0].sign}</span>
                                    </div>
                                    <div class={s.text}>
                                        <div class={s.tagAndAmount}>
                                            <span class={s.tag}>{item.tags![0].name}</span>
                                            <span class={s.amount}>￥<Money value={item.amount}/></span>
                                        </div>
                                        <div class={s.time}><Datetime value={item.happen_at}/></div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <div class={s.more}>
                            {/*如果有hasMore就显示加载更多的按钮*/}
                            {hasMore.value ?
                                <Button class={s.hasMore} onClick={fetchItems}>加载更多</Button> :
                                <span class={s.noMore}>没有更多</span>
                            }
                        </div>
                    </>
                ) : (
                    //没有items就显示记录为空
                    <div>记录为空</div>
                )}
                <FloatButton iconName="add"/>
            </div>
        )
    },
})