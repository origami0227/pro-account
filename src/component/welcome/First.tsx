import {FunctionalComponent} from 'vue';
import s from './WelcomLayout.module.scss'
import {RouterLink} from "vue-router";
import {WelcomeLayout} from './WelcomeLayout'
import pig from '../../assets/icons/pig.svg';

export const First: FunctionalComponent = () => {
    return <WelcomeLayout>{{
        icon: () => <img src={pig}/>,
        title: () => <h2>会挣钱<br/>还会省钱</h2>,
        buttons: () => <>
            <RouterLink class={s.fake} to="/start">跳过</RouterLink>
            <RouterLink to="/welcome/2">下一页</RouterLink>
            <RouterLink to="/start">跳过</RouterLink>
        </>
    }}</WelcomeLayout>
}
First.displayName = 'First'
