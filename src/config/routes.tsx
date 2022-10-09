import { RouteRecordRaw } from 'vue-router'
import { First } from '../component/welcome/first'
import { Forth } from '../component/welcome/forth'
import { Second } from '../component/welcome/second'
import { Third } from '../component/welcome/third'
import { Bar } from '../views/Bar'
import { Foo } from '../views/Foo'
import { welcome } from '../views/Welcome'
export const routes: RouteRecordRaw[] = [
  { path: '/', component: Foo },
  { path: '/about', component: Bar },
  {
    path: '/welcome',
    component: welcome,
    children: [
      { path: '1', component: First },
      { path: '2', component: Second },
      { path: '3', component: Third },
      { path: '4', component: Forth },
    ],
  },
]
