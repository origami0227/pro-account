import { RouteRecordRaw } from "vue-router";
import { First } from "../component/welcome/First";
import { FirstActions } from "../component/welcome/FirstActions";
import { Forth } from "../component/welcome/Forth";
import { ForthActions } from "../component/welcome/ForthActions";
import { Second } from "../component/welcome/Second";
import { SecondActions } from "../component/welcome/SecondActions";
import { Third } from "../component/welcome/Third";
import { ThirdActions } from "../component/welcome/ThirdActions";
import { Welcome } from "../views/Welcome";

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  {
    path: '/welcome',
    component: Welcome,
    children: [
      { path: '', redirect: '/welcome/1', },
      { path: '1', components: { main: First, footer: FirstActions }, },
      { path: '2', components: { main: Second, footer: SecondActions }, },
      { path: '3', components: { main: Third, footer: ThirdActions }, },
      { path: '4', components: { main: Forth, footer: ForthActions }, },
    ]
  }
]