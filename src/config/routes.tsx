import { RouteRecordRaw } from 'vue-router'
import { First } from '../component/welcome/First'
import { Forth } from '../component/welcome/Forth'
import { Second } from '../component/welcome/Second'
import { Third } from '../component/welcome/Third'
import { welcome } from '../views/Welcome'
export const routes: RouteRecordRaw[] = [
  { path: '/', redirect:'/welcome' },//默认路由
  {
    path: '/welcome',
    component: welcome,
    children: [
      {path:'',redirect:'/welcome/1'},//默认路由
      { path: '1', component: First },
      { path: '2', component: Second },
      { path: '3', component: Third },
      { path: '4', component: Forth },
    ],
  },
]
