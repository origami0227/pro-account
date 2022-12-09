import {defineComponent, PropType} from 'vue'
import {Center} from './Center'
import s from './ComingSoon.module.scss'
import {Icon} from './Icon'
import {useRouter} from "vue-router";
import {Button} from "vant";

export const ComingSoon = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const router = useRouter()
        const onClick = () => {
            router.back()
        }
        return () => (
            <div>
                <Center class={s.kabi_wrapper}>
                    <Icon name="kabi" class={s.kabi}/>
                </Center>
                <p class={s.text}>敬请期待</p>
                <p class={s.link}>
                    <Button onClick={onClick}>返回</Button>
                </p>
            </div>
        )
    }
})
export default ComingSoon