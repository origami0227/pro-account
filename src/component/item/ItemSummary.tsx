import {defineComponent, onMounted, PropType, ref} from 'vue';
import { FloatButton } from '../../shared/FloatButton';
import s from './ItemSummary.module.scss';
import {http} from "../../shared/Http";
import {Button} from "vant";
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
            if(!props.startDate || !props.endDate){ return }
            //get获取信息
            const response = await http.get<Resources<Item>>('/items', {
                happen_after: props.startDate,//起始事件
                happen_before: props.endDate, //结束事件
                page: page.value + 1,
                _mock: 'itemIndex', //mock数据
            })
            //析构赋值拿到resources和pager
            const { resources, pager } = response.data
            //放入items里面
            items.value?.push(...resources)
            //计算下一页的方法
            hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
            page.value += 1
        }
        onMounted(fetchItems)//挂载时发送请求
        return () => (
            <div class={s.wrapper}>
                {items.value ? (
                    <>
                        <ul class={s.total}>
                            <li>
                                <span>收入</span>
                                <span>128</span>
                            </li>
                            <li>
                                <span>支出</span>
                                <span>99</span>
                            </li>
                            <li>
                                <span>净收入</span>
                                <span>39</span>
                            </li>
                        </ul>
                        <ol class={s.list}>
                            {items.value.map((item) => (
                                <li>
                                    <div class={s.sign}>
                                        <span>{item.tags_id[0]}</span>
                                    </div>
                                    <div class={s.text}>
                                        <div class={s.tagAndAmount}>
                                            <span class={s.tag}>{item.tags_id[0]}</span>
                                            <span class={s.amount}>￥<>{item.amount}</></span>
                                        </div>
                                        <div class={s.time}>{item.happen_at}</div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <div class={s.more}>
                            {/*如果有hasMore就显示加载更多的按钮*/}
                            {hasMore.value ?
                                <Button onClick={fetchItems}>加载更多</Button> :
                                <span>没有更多</span>
                            }
                        </div>
                    </>
                ) : (
                    //没有items就显示记录为空
                    <div>记录为空</div>
                )}
                <FloatButton iconName="add" />
            </div>
        )
    },
})