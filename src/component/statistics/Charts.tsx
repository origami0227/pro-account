import {computed, defineComponent, onMounted, PropType, reactive, ref} from 'vue';
import s from './Charts.module.scss';
import {FormItem} from "../../shared/Form";
import {LineChart} from './LineChart';
import {PieChart} from './PieChart';
import {Bars} from './Bars';
import {http} from "../../shared/Http";
import {Time} from "../../shared/time";

type Data1Item = {happen_at:string, amount: number}
type Data1 = Data1Item[]
const DAY = 24 * 3600 * 1000 //常量 一天的毫秒数
export const Charts = defineComponent({
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
        const kind = ref('expenses')
        const data1 = ref<Data1>([]) //data容器
        const betterData1 = computed<[string, number][]>(()=> {
            if(!props.startDate || !props.endDate) { return [] }
            const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
            const n = diff / DAY + 1
            //Array.from({length:n})这种声明方法是有key的也就是有下标，然后进行map
            //否则需要fill
            return Array.from({length: n}).map((_, i)=>{
                const time = new Time(props.startDate+'T00:00:00.000+0800').add(i, 'day').getTimestamp()
                const item = data1.value[0]
                const amount = (item && new Date(item.happen_at).getTime() === time)
                    ? data1.value.shift()!.amount //拿到data1的第一项
                    : 0
                return [new Date(time).toISOString(), amount]
            })
        })

        onMounted(async ()=>{
            //挂载时请求记账数据
            const response = await http.get<{groups: Data1, summary: number}>('/items/summary',{
                happen_after: props.startDate, //开始时间
                happen_before: props.endDate, //结束时间
                kind: kind.value, //收入或者支出
                _mock: 'itemSummary' //mock数据
            })
            data1.value = response.data.groups //赋值给data1
        })
        return () => (
            <div class={s.wrapper}>
                <FormItem label="类型" type="select" options={[
                    {value: 'expenses', text: '支出'},
                    {value: 'income', text: '收入'},
                ]}
                          v-model={kind.value}/>
                <LineChart data={betterData1.value}/>
                <PieChart/>
                <Bars/>
            </div>
        )
    }
})