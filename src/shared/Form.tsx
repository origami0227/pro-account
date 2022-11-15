import {computed, defineComponent, PropType, VNode, ref} from 'vue';
import {DatetimePicker, Popup} from 'vant';
import {EmojiSelect} from './EmojiSelect';
import s from './Form.module.scss';
import {Time} from './time';
import {Button} from "./Button";
import {getFriendlyError} from "./getFriendlyError";

export const Form = defineComponent({
    props: {
        onSubmit: {
            type: Function as PropType<(e: Event) => void>,
        }
    },
    emits: ['update:modelValue'],
    setup: (props, context) => {
        return () => (
            <form class={s.form} onSubmit={props.onSubmit}>
                {context.slots.default?.()}
            </form>
        )
    }
})

export const FormItem = defineComponent({
    props: {
        label: {
            type: String
        },
        modelValue: {
            type: [String, Number]
        },
        type: {
            type: String as PropType<'text' | 'emojiSelect' | 'date' | 'validationCode' | 'select'>,
        },
        error: {
            type: String
        },
        placeholder: String,
        options: Array as PropType<Array<{ value: string, text: string }>>,
        onClick: Function as PropType<() => void>,
        countFrom: {
            type: Number,
            default: 60
        }
    },
    setup: (props, context) => {
        const refDateVisible = ref(false)
        const timer = ref<number>()//间隔器
        const count = ref<number>(props.countFrom)//数字显示
        const isCounting = computed(() => !!timer.value)//计算属性判断发送验证码的状态,isCounting的布尔值和timer的value同时为真或者同时为假
        const startCount = () => {
            timer.value = setInterval(() => {
                count.value -= 1
                if (count.value === 0) {
                    clearInterval(timer.value)
                    timer.value = undefined//重置
                    count.value = props.countFrom//重置
                }
            }, 1000)
        }
        context.expose({
            // startCount:startCount //左边是字符串右边是函数可以缩写为下面
            startCount
        })
        const content = computed(() => {
            switch (props.type) {
                case 'text':
                    return <input
                        value={props.modelValue}
                        placeholder={props.placeholder}
                        onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
                        class={[s.formItem, s.input]}/>
                case 'emojiSelect':
                    return <EmojiSelect
                        modelValue={props.modelValue?.toString()}
                        // @ts-ignore
                        onUpdateModelValue={value => context.emit('update:modelValue', value)}
                        class={[s.formItem, s.emojiList, s.error]}/>
                case 'validationCode':
                    return <>
                        <input class={[s.formItem, s.input, s.validationCodeInput]}
                               placeholder={props.placeholder}/>
                        <Button disabled={isCounting.value} onClick={props.onClick}
                                class={[s.formItem, s.button, s.validationCodeButton]}>
                            {isCounting.value ? `${count.value}秒后可发送` : '发送验证码'}
                        </Button>
                    </>
                case 'select':
                    return <select class={[s.formItem, s.select]} value={props.modelValue}
                                   onChange={(e: any) => {
                                       context.emit('update:modelValue', e.target.value)
                                   }}>
                        {props.options?.map(option =>
                            <option value={option.value}>{option.text}</option>
                        )}
                    </select>
                case 'date':
                    return <>
                        <input readonly={true} value={props.modelValue}
                               placeholder={props.placeholder}
                               onClick={() => {
                                   refDateVisible.value = true
                               }}
                               class={[s.formItem, s.input]}/>
                        <Popup position='bottom' v-model:show={refDateVisible.value}>
                            <DatetimePicker value={props.modelValue} type="date" title="选择年月日"
                                            onConfirm={(date: Date) => {
                                                context.emit('update:modelValue', new Time(date).format())
                                                refDateVisible.value = false
                                            }}
                                            onCancel={() => refDateVisible.value = false}/>
                        </Popup>
                    </>
                case undefined:
                    return context.slots.default?.()
            }
        })
        return () => {
            return <div class={s.formRow}>
                <label class={s.formLabel}>
                    {props.label &&
                        <span class={s.formItem_name}>{props.label}</span>
                    }
                    <div class={s.formItem_value}>
                        {content.value}
                    </div>
                    <div class={s.formItem_errorHint}>
                        <span>{props.error ? getFriendlyError(props.error) : ' '}</span>
                    </div>
                </label>
            </div>
        }
    }
})