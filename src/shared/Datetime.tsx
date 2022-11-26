import {computed, defineComponent, PropType} from 'vue'
import {Time} from './time'

export const Datetime = defineComponent({
    props: {
        value: {
            type: [Date, String] as PropType<string | Date>,
            required: true,
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD HH:mm:ss',//默认格式
        },
    },
    setup: (props, context) => {
        //计算属性，把原来的格式转化成用户能看懂的格式
        const toDisplay = computed(() =>
            new Time(props.value).format(props.format))
        return () => <div>{toDisplay.value}</div>
    },
})