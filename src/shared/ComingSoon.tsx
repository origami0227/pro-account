import { defineComponent, PropType } from 'vue'
import { Center } from './Center'
import s from './ComingSoon.module.scss'
import { Icon } from './Icon'
export const ComingSoon = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            <div>
                <Center class={s.kabi_wrapper}>
                    <Icon name="kabi" class={s.kabi} />
                </Center>
                <p class={s.text}>敬请期待</p>
            </div>
        )
    }
})