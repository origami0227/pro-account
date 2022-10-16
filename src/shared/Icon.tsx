import {defineComponent, defineProps, PropType} from 'vue';
import s from './Icon.module.scss';


export type IconName = 'add' | 'chart' | 'clock' | 'cloud' | 'kabi' | 'pig' | 'menu' | 'charts' | 'notify' | 'export' | 'left'
export const Icon = defineComponent({
    props: {
        name: {
            type: String as PropType<IconName>,
            required: true,
        },
        onClick: {
            type: Function as PropType<(e: MouseEvent) => void>
        }
    },
    setup: (props, context) => {
        return () => (
            <svg class={s.icon}>
                <use xlinkHref={'#' + props.name} onClick={props.onClick}></use>
            </svg>
        )
    }
})