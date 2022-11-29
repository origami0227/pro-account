import {defineComponent, onMounted, ref} from 'vue';
import {Button} from '../shared/Button';
import {Center} from '../shared/Center';
import {FloatButton} from '../shared/FloatButton';
import {Icon} from '../shared/Icon';
import s from './StartPage.module.scss';
import {OverlayIcon} from "../shared/Overlay";
import {RouterLink} from "vue-router";
import {MainLayout} from "../layouts/MainLayout";
import {Toast} from "vant";


export const StartPage = defineComponent({
    setup: (props, context) => {
        //UI演示
        // onMounted(()=>{
        //     // Toast.loading({
        //     //   message: '加载中...',
        //     //   forbidClick: true,
        //     //   duration: 0
        //     // });
        // })
        return () => (

            <MainLayout>{
                {
                    title: () => '卡比记账',
                    icon: () => <OverlayIcon/>,
                    default: () => (<>
                            <Center class={s.pig_wrapper}>
                                <Icon name="pig" class={s.pig}/>
                            </Center>
                            <div class={s.button_wrapper}>
                                <RouterLink to="/items/create">
                                    <Button class={s.button}>开始记账</Button>
                                </RouterLink>

                            </div>
                            <RouterLink to="/items/create">
                                <FloatButton iconName='add'/>
                            </RouterLink>
                        </>
                    )
                }
            }</MainLayout>

        )
    }
})