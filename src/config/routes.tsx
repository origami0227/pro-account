import {RouteRecordRaw} from "vue-router";
import {First} from "../component/welcome/First";
import {FirstActions} from "../component/welcome/FirstActions";
import {Forth} from "../component/welcome/Forth";
import {ForthActions} from "../component/welcome/ForthActions";
import {Second} from "../component/welcome/Second";
import {SecondActions} from "../component/welcome/SecondActions";
import {Third} from "../component/welcome/Third";
import {ThirdActions} from "../component/welcome/ThirdActions";
import {Welcome} from "../views/Welcome";
import {StartPage} from "../views/StartPage";
import {ItemCreate} from "../component/item/ItemCreate";
import {ItemPage} from "../views/ItemPage";
import {ItemList} from "../component/item/ItemList";
import {TagPage} from "../views/TagPage";
import {TagCreate} from "../component/tag/TagCreate";
import {TagEdit} from "../component/tag/TagEdit";

export const routes: RouteRecordRaw[] = [
    {path: '/', redirect: '/welcome'},
    {
        path: '/welcome',
        component: Welcome,
        children: [
            {path: '', redirect: '/welcome/1',},
            {path: '1', name: 'Welcome1', components: {main: First, footer: FirstActions},},
            {path: '2', name: 'Welcome2', components: {main: Second, footer: SecondActions},},
            {path: '3', name: 'Welcome3', components: {main: Third, footer: ThirdActions},},
            {path: '4', name: 'Welcome4', components: {main: Forth, footer: ForthActions},},
        ]
    },
    {path: '/start', component: StartPage},
    {
        path: '/items', component: ItemPage,
        children: [
            {path: '', component: ItemList},
            {path: 'create', component: ItemCreate},
        ]
    },
    {
        path: '/tags', component: TagPage,
        children: [
            {path: 'create', component: TagCreate},
            {path: ':id/edit', component: TagEdit}
        ]
    },
]