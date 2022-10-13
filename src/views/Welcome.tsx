import {defineComponent, ref, Transition, VNode, watchEffect} from 'vue';
import {RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter} from 'vue-router';
import s from './Welcome.module.scss'
import {useSwipe} from "../hooks/useSwipe";
import {throttle} from '../shared/throttle';

const pushMap: Record<string, string> = {
    'Welcome1': '/welcome/2',
    'Welcome2': '/welcome/3',
    'Welcome3': '/welcome/4',
    'Welcome4': '/start',
}
export const Welcome = defineComponent({
    setup: (props, context) => {
        const main = ref<HTMLElement>()
        // @ts-ignore
        const route = useRoute()
        const router = useRouter()
        const {direction, swiping} = useSwipe(main, {beforeStart: e => e.preventDefault()})
        const push = throttle(() => {
            const name = (route.name || 'Welcome1').toString()
            router.push(pushMap[name])
        }, 500)//左滑动作
        watchEffect(() => {
            if (swiping.value && direction.value === 'left') {
                push()
            }
        })
        return () => <div class={s.wrapper}>
            <header>
                <svg>
                    <use xlinkHref='#kabi'></use>
                </svg>
                <h1>卡比记账</h1>
            </header>
            <main class={s.main} ref={main}>
                <RouterView name="main">
                    {({Component: X, route: R}: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
                        <Transition enterFromClass={s.slide_fade_enter_from}
                                    enterActiveClass={s.slide_fade_enter_active}
                                    leaveToClass={s.slide_fade_leave_to} leaveActiveClass={s.slide_fade_leave_active}>
                            {X}
                        </Transition>
                    }
                </RouterView>
            </main>
            <footer>
                <RouterView name="footer"/>
            </footer>
        </div>
    }
})