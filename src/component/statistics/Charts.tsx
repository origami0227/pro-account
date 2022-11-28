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
            //判断
            if(!props.startDate || !props.endDate) {
                return []
            }
            //声明一个空数组，然后向这个数组里面push进一个月的数据
            const array = []
            //diff算出这个月有多少天 用结束时间戳减去开始时间戳算出秒
            const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
            //n等于 diff算出的秒除以一天的秒数➕1得到天数
            const n = diff / DAY + 1
            let data1Index = 0
            for(let i=0; i<n; i++) {
                //格式要求
                const time = new Time(props.startDate+'T00:00:00.000+0800').add(i, 'day').getTimestamp()
                if(data1.value[data1Index] && new Date(data1.value[data1Index].happen_at).getTime() === time){
                    //放进空数组
                    array.push([new Date(time).toISOString(), data1.value[data1Index].amount])
                    data1Index += 1
                }else{
                    array.push([new Date(time).toISOString(), 0])
                }
            }
            return array as [string, number][]
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