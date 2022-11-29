import {createApp} from 'vue'
import {App} from './App'
import {createRouter} from 'vue-router'
import {routes} from './config/routes'
import {history} from './shared/history'
import '@svgstore';
import {fetchMe, mePromise} from './shared/me';

const router = createRouter({history, routes})
fetchMe()//刷新获取用户信息
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
    return mePromise!.then(//beforeEach可以直接return一个promise
        () => true,//可以获取到用户信息
        () => '/sign_in?return_to=' + to.path//false 获取不到用户信息再跳转到登陆界面
    )

})

const app = createApp(App)
app.use(router)
app.mount('#app')
