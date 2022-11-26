import { defineComponent, PropType } from 'vue'
export const Money = defineComponent({
    props: {
        //接受一个属性 value
        value: {
            type: Number as PropType<number>,
            required: true,
        },
    },
    setup: (props, context) => {
        //补零函数
        const addZero = (n: number) => {
            const nString = n.toString()//字符串化
            const dotIndex = nString.indexOf('.')//看是否有小数点
            //条件判断
            if (dotIndex < 0) {
                //没有小数点
                return nString + '.00'
            } else if (nString.substring(dotIndex).length === 2) {
                //第一位是.第二位是数字就补充一个0
                return nString + '0'
            } else {
                return nString
            }
        }
        return () => <span>{addZero(props.value / 100)}</span>
    },
})