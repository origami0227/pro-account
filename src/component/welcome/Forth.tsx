import {defineComponent} from 'vue';
import s from './First.module.scss';
import cloud from '../../assets/icons/cloud.svg';
import {RouterLink} from 'vue-router';
import {WelcomeLayout} from './WelcomeLayout';

export const Forth = defineComponent({
    setup: (props, context) => {
        return () => (
            <WelcomeLayout>
                {{
                    icon: () => <img class={s.icon} src={cloud}/>,
                    title: () => <h2>云备份<br/>再也不怕数据丢失</h2>,
                    buttons: () => <>
                        <RouterLink class={s.fake} to="/start">跳过</RouterLink>
                        <RouterLink to="/start">完成</RouterLink>
                        <RouterLink class={s.fake} to="/start">跳过</RouterLink>
                    </>

                }}
            </WelcomeLayout>
        )
    }
})