import {createApp} from 'vue'
import {App} from './App'
import {createRouter} from 'vue-router'
import {routes} from './config/routes'
import {history} from './shared/history'
import '@svgstore';
import {useMeStore} from "./stores/useMeStore";
import {createPinia, storeToRefs} from "pinia";
import {Dialog} from "vant";

const router = createRouter({history, routes})
const pinia = createPinia() //创建Pinia
const app = createApp(App)
app.use(router)
app.use(pinia) //使用Pinia
app.mount('#app')

const meStore = useMeStore()
const {mePromise} = storeToRefs(meStore)
meStore.fetchMe()

// fetchMe()//刷新获取用户信息
const whiteList: Record<string, 'exact' | 'startsWith'> = {
    '/': 'exact',
    '/items': 'exact',
    '/welcome': 'startsWith',
    '/sign_in': 'startsWith',
}//定义白名单

router.beforeEach(async (to, from) => {
    for (const key in whiteList) {//遍历白名单
        const value = whiteList[key]
        if (value === 'exact' && to.path === key) {
            return true
        }
        if (value === 'startsWith' && to.path.startsWith(key)) {
            return true
        }
    }
    return mePromise!.value!.then(//beforeEach可以直接return一个promise
        () => true,//可以获取到用户信息

        async () => {
            await Dialog.alert({
                title:'提示',
                message:'请先登录'
            })
            return '/sign_in?return_to=' + from.path//false 获取不到用户信息再跳转到登陆界面
        }
    )

})
