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
        const refKind = ref('支出')

        const { tags:expensesTags, hasMore, fetchTags } = useTags((page) => {
            return http.get<Resources<Tag>>('/tags', {
                kind: 'expenses',
                page: page + 1,
                _mock: 'tagIndex'
            })
        })
        const { tags: incomeTags,
            hasMore: hasMore2,
            fetchTags: fetchTags2
        } = useTags((page) => {
            return http.get<Resources<Tag>>('/tags', {
                kind: 'income',
                page: page + 1,
                _mock: 'tagIndex'
            })
        })

        return () => (
            <MainLayout class={s.layout}>{{
                title: () => '记一笔',
                icon: () => <Icon name="left" class={s.navIcon} />,
                default: () => <>
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={refKind.value} class={s.tabs}>
                            <Tab name="支出">
                                <Tags kind="expenses"/>
                            </Tab>
                            <Tab name="收入">
                                <Tags kind="income"/>
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