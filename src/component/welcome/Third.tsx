import {defineComponent} from 'vue';
import s from './First.module.scss';
import chart from '../../assets/icons/chart.svg';
import {RouterLink} from 'vue-router';
import {WelcomeLayout} from './WelcomeLayout';

export const Third = defineComponent({
    setup: (props, context) => {
        return () => (
            <WelcomeLayout>
                {{
                    icon: () => <img class={s.icon} src={chart}/>,
                    title: () => <h2>数据可视化<br/>收支一目了然</h2>,
                    buttons: () => <>
                        <RouterLink class={s.fake} to="/start">跳过</RouterLink>
                        <RouterLink to="/welcome/4">下一页</RouterLink>
                        <RouterLink to="/start">跳过</RouterLink>
                    </>
                }}
            </WelcomeLayout>
        )
    }
})