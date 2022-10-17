import {defineComponent, PropType, ref} from 'vue';
import {Icon} from '../../shared/Icon';
import {time} from '../../shared/time';
import s from './InputPad.module.scss';
import {DatetimePicker, Popup} from 'vant';

export const InputPad = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const now = new Date()
        const buttons = [
            { text: '1', onClick: () => { appendText(1) }},
            { text: '2', onClick: () => { appendText(2) } },
            { text: '3', onClick: () => { appendText(3) } },
            { text: '4', onClick: () => { appendText(4) } },
            { text: '5', onClick: () => { appendText(5) } },
            { text: '6', onClick: () => { appendText(6) } },
            { text: '7', onClick: () => { appendText(7) } },
            { text: '8', onClick: () => { appendText(8) } },
            { text: '9', onClick: () => { appendText(9) } },
            { text: '.', onClick: () => { appendText('.') } },
            { text: '0', onClick: () => { appendText(0) } },
            { text: '清空', onClick: () => {refAmount.value = '0'}},
            { text: '提交', onClick: () => {}},
        ]
        const refDate = ref<Date>(now)//用户选择的时间
        const refDatePickerVisible = ref(false)//默认关闭
        const showDatePicker = () => {
            refDatePickerVisible.value = true
        }//打开
        const hideDatePicker = () => {
            refDatePickerVisible.value = false
        }//关闭
        const setDate = (date: Date) => {
            refDate.value = date;
            hideDatePicker()
        }
        const refAmount = ref('0')
        const appendText = (n: number | string) => refAmount.value += n.toString()
        return () => <>
            <div class={s.dateAndAmount}>
        <span class={s.date}>
          <Icon name="date" class={s.icon}/>
          <span>
            <span onClick={showDatePicker}>{time(refDate.value).format()}</span>
              <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
                  <DatetimePicker value={refDate.value} type="date" title="选择年月日"
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