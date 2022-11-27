import {computed, defineComponent, onMounted, PropType, reactive, ref} from 'vue';
import s from './Charts.module.scss';
import {FormItem} from "../../shared/Form";
import {LineChart} from './LineChart';
import {PieChart} from './PieChart';
import {Bars} from './Bars';
import {http} from "../../shared/Http";

type Data1Item = {happen_at:string, amount: number}
type Data1 = Data1Item[]

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
        const betterData1 = computed(()=> { //{happen_at , amount}
            return data1.value.map(item=>
                //对象转换成数组
                [item.happen_at, item.amount] as [string, number]
            )
        })

        onMounted(async ()=>{
            //挂载时请求记账数据
            const response = await http.get<{groups: Data1, summary: number}>('/items/summary',{
                happen_after: props.startDate, //开始时间
                happen_before: props.endDate, //结束时间
                kind: kind.value, //收入或者支出
                _mock: 'itemSummary' //mock数据
            })
            console.log('response.data')
            console.log(response.data)
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