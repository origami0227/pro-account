import {defineComponent, PropType, ref} from 'vue';
import {Icon} from '../../shared/Icon';
import {Time} from '../../shared/time';
import s from './InputPad.module.scss';
import {DatetimePicker, Popup} from 'vant';

export const InputPad = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        },
        happenAt: String,
        amount: Number,
    },
    emits: ['update:happenAt','update:Amount'],
    setup: (props, context) => {
        const now = new Date()
        // const refDate = ref<Date>(now)//用户选择的时间 默认是现在的时间
        const buttons = [
            {
                text: '1', onClick: () => {
                    appendText(1)
                }
            },
            {
                text: '2', onClick: () => {
                    appendText(2)
                }
            },
            {
                text: '3', onClick: () => {
                    appendText(3)
                }
            },
            {
                text: '4', onClick: () => {
                    appendText(4)
                }
            },
            {
                text: '5', onClick: () => {
                    appendText(5)
                }
            },
            {
                text: '6', onClick: () => {
                    appendText(6)
                }
            },
            {
                text: '7', onClick: () => {
                    appendText(7)
                }
            },
            {
                text: '8', onClick: () => {
                    appendText(8)
                }
            },
            {
                text: '9', onClick: () => {
                    appendText(9)
                }
            },
            {
                text: '.', onClick: () => {
                    appendText('.')
                }
            },
            {
                text: '0', onClick: () => {
                    appendText(0)
                }
            },
            {
                text: '清空', onClick: () => {
                    refAmount.value = '0'
                }
            },
            {
                text: '记账', onClick: () => {
                }
            },
        ]
        const refDatePickerVisible = ref(false)//默认关闭
        const showDatePicker = () => {
            refDatePickerVisible.value = true
        }//打开
        const hideDatePicker = () => {
            refDatePickerVisible.value = false
        }//关闭
        const setDate = (date: Date) => {
            context.emit('update:happenAt',date.toISOString()) //赋值改成传一个新的字符串
            hideDatePicker()
        }
        const refAmount = ref('0')
        const appendText = (n: number | string) => {
            const nString = n.toString()
            const dotIndex = refAmount.value.indexOf('.') //记录小数点
            if (refAmount.value.length >= 13) {//最多13位 整数部分10位
                return
            }
            if (dotIndex >= 0 && refAmount.value.length - dotIndex > 2) {//有小数点且小数点之后最多两位
                return
            }
            if (nString === '.') {//如果要输入一个 小数点
                if (dotIndex >= 0) {// 如果已经有小数点了
                    return //相当于没打
                }
            } else if (nString === '0') {//如果要输入0
                if (refAmount.value === '0') {//但是前面有一个0 也就00这种写法不被允许
                    return
                }
            } else { //不输入小数点也不输入0
                if (refAmount.value === '0') {
                    refAmount.value = '' //把初始的0删除
                }
            }
            refAmount.value += nString
        }
        return () => <>
            <div class={s.dateAndAmount}>
        <span class={s.date}>
          <Icon name="date" class={s.icon}/>
          <span>
            <span onClick={showDatePicker}>{new Time(props.happenAt).format()}</span>
              <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
                  <DatetimePicker value={props.happenAt} type="date" title="选择年月日"
                                  onConfirm={setDate} onCancel={hideDatePicker}/>
              </Popup>

          </span>
        </span>
                <span class={s.amount}>{refAmount.value}</span>
            </div>
            <div class={s.buttons}>
                {buttons.map(button =>
                    <button onClick={button.onClick}>{button.text}</button>
                )}
            </div>
        </>
    }
})