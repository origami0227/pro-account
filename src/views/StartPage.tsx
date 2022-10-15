import {defineComponent, ref} from 'vue';
import {Button} from '../shared/Button';
import {Center} from '../shared/Center';
import {FloatButton} from '../shared/FloatButton';
import {Icon} from '../shared/Icon';
import s from './StartPage.module.scss';
import {Navbar} from '../shared/Navbar';
import {Overlay} from "../shared/Overlay";

export const StartPage = defineComponent({
    setup: (props, context) => {
        const refOverlayVisible = ref(false)
        const onClickMenu = () => {
            refOverlayVisible.value = !refOverlayVisible.value
        }
        return () => (
            <div>
                <Navbar>{
                    {
                        default: () => '卡比记账',
                        icon: () => <Icon name="menu" class={s.navIcon} onClick={onClickMenu}/>
                    }
                }</Navbar>
                <Center class={s.pig_wrapper}>
                    <Icon name="pig" class={s.pig}/>
                </Center>
                <div class={s.button_wrapper}>
                    <Button class={s.button}>开始记账</Button>
                </div>
                <FloatButton iconName='add'/>
                {refOverlayVisible.value &&
                    <Overlay onClose={() => refOverlayVisible.value = false}/>//如果overLayVisible的value存在才会展示。 点击触发让value取反
                }
            </div>
        )
    }
})