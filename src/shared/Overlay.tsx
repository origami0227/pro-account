import {defineComponent, onMounted, PropType, ref} from 'vue';
import {Icon} from './Icon';
import s from './Overlay.module.scss';
import {RouterLink, useRoute} from 'vue-router';
import {Dialog} from "vant";
import {useMeStore} from "../stores/useMeStore";

export const Overlay = defineComponent({
    props: {
        onClose: {
            type: Function as PropType<() => void>
        }
    },
    setup: (props, context) => {
        const route = useRoute()
        const me = ref<User>() //标记用户是否登录
        const meStore = useMeStore()
        onMounted(async () => {
            //获取用户登录信息
            const response = await meStore.mePromise
            //将请求拿到的信息赋值给me
            me.value = response?.data.resource
        })
        const onSignOut = async () => {
            //登出弹窗提醒
            await Dialog.confirm({
                title: '确认',
                message: '你真的要退出登录吗？',
            })
            //移除登录信息
            localStorage.removeItem('jwt')
            window.location.reload() //重新加载
        }
        const close = () => {
            props.onClose?.()
        }


        return () => <>
            <div class={s.mask} onClick={close}></div>
            <div class={s.overlay}>
                <section class={s.currentUser}>
                    {me.value ? (
                        //如果存在就返回用户的登录邮箱
                        <div>
                            <h2 class={s.email}>{me.value.email}</h2>
                            <p onClick={onSignOut}>点击这里退出登录</p>
                        </div>
                    ) : (
                        //否则就显示为登录并可以跳转到登录界面
                        <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
                            <h2>未登录用户</h2>
                            <p>点击这里登录</p>
                        </RouterLink>
                    )}
                </section>
                <nav>
                    <ul class={s.action_list}>
                        <li>
                            <RouterLink to="/items" class={s.action}>
                                <Icon name="kabi" class={s.icon} />
                                <span>记账列表</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/statistics" class={s.action}>
                                <Icon name="charts" class={s.icon}/>
                                <span>统计图表</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/export" class={s.action}>
                                <Icon name="export" class={s.icon}/>
                                <span>导出数据</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/notify" class={s.action}>
                                <Icon name="notify" class={s.icon}/>
                                <span>记账提醒</span>
                            </RouterLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    }
})

export const OverlayIcon = defineComponent({
    setup: (props, context) => {
        const refOverlayVisible = ref(false)
        const onClickMenu = () => {
            refOverlayVisible.value = !refOverlayVisible.value
        }
        return () => <>
            <Icon name="menu" class={s.icon} onClick={onClickMenu}/>
            {refOverlayVisible.value &&
                <Overlay onClose={() => refOverlayVisible.value = false}/>
            }
        </>

    }
})