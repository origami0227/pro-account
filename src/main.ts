import {createApp} from 'vue'
import {App} from './App'
import {createRouter} from 'vue-router'
import {routes} from './config/routes'
import {history} from './shared/history'
import '@svgstore';
import { fetchMe, mePromise } from './shared/me';

const router = createRouter({history, routes})
fetchMe()//刷新获取用户信息
router.beforeEach(async (to, from) => {
    if (to.path === '/' || to.path.startsWith('/welcome/') || to.path === '/sign_in' || to.path === '/start') {
        return true
    } else {
        const path = await mePromise!.then(
            () => true,//可以获取到用户信息
            () => '/sign_in?return_to=' + to.path//false 获取不到用户信息再跳转到登陆界面
        )
        return path
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
