import {computed, defineComponent, PropType, ref} from 'vue';
import s from './Button.module.scss';

interface Props {
}

export const Button = defineComponent({
    props: {
        onClick: {
            type: Function as PropType<(e: MouseEvent) => void>
        },
        level: {
            type: String as PropType<'important' | 'normal' | 'danger'>,
            default: 'important'
        },
        type: {
            type: String as PropType<'submit' | 'button'>,
            default: 'button'
        },
        disabled:{
            type:Boolean,
            default:false,
        },
        autoSelfDisabled: {
            type: Boolean,
            default: false
        }
    },
    setup: (props, context) => {
        const selfDisabled = ref(false)
        const _disabled = computed(()=>{
            if(props.autoSelfDisabled === false){
                return props.disabled
            }
            if(selfDisabled.value){
                return true
            }else{
                return props.disabled
            }
        })
        const onClick = (e:MouseEvent)=>{
            // @ts-ignore
            props.onClick?.(e)
            selfDisabled.value = true //点击后自我沉默
            setTimeout(()=>{
                selfDisabled.value = false
            },500)
        }
        return () => (
            <button disabled={_disabled.value} onClick={onClick} type={props.type} class={[s.button, s[props.level]]}>
                {context.slots.default?.()}
            </button>
        )
    }
})