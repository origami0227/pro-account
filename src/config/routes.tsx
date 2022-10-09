import { RouteRecordRaw } from 'vue-router'
import { First } from '../component/welcome/First'
import { Forth } from '../component/welcome/Forth'
import { Second } from '../component/welcome/Second'
import { Third } from '../component/welcome/Third'
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
