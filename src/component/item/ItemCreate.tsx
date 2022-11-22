import {defineComponent, onMounted, onUpdated, PropType, ref} from 'vue';
import s from './ItemCreate.module.scss';
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";
import {Tab, Tabs} from "../../shared/Tabs";
import {InputPad} from "./InputPad";
import {http} from "../../shared/Http";
import {Button} from "../../shared/Button";
import {useTags} from "../../shared/useTags";
import {Tags} from "./Tags";


export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refKind = ref('支出') //标记支出收入的tab
        const refTagId = ref<number>() //标记tag 传给后端一个id
        return () => (
            <MainLayout class={s.layout}>{{
                title: () => '记一笔',
                icon: () => <Icon name="left" class={s.navIcon} />,
                default: () => <>
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={refKind.value} class={s.tabs}>
                            <Tab name="支出">
                                <Tags kind="expenses" v-model:selected={refTagId.value}/>
                            </Tab>
                            <Tab name="收入">
                                <Tags kind="income" v-model:selected={refTagId.value}/>
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            <InputPad />
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})