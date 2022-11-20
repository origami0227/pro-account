import {defineComponent, onMounted, onUpdated, PropType, ref} from 'vue';
import s from './ItemCreate.module.scss';
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";
import {Tab, Tabs} from "../../shared/Tabs";
import {InputPad} from "./InputPad";
import {http} from "../../shared/Http";


export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refKind = ref('支出')
        //发送请求的操作在onMounted中完成
        onMounted(async () => {
            //第一次请求支持支出 expenses  注意get的第二个参数就是查询参数 不仅可以定义字符串，还可以定义函数的类型
            const response = await http.get<{ resources: Tag[] }>('/tags', {
                //查询参数
                kind: 'expenses',
                _mock: 'tagIndex',
            })
            refExpensesTags.value = response.data.resources//赋值
        })
        onMounted(async () => {
            //第一次请求支持支出 income
            const response = await http.get<{ resources: Tag[] }>('/tags', {
                //查询参数
                kind: 'income',
                _mock: 'tagIndex',
            })
            refIncomeTags.value = response.data.resources//赋值
        })
        const refExpensesTags = ref<Tag[]>([])
        const refIncomeTags = ref<Tag[]>([])
        return () => (
            <MainLayout class={s.layout}>{{
                title: () => '记一笔',
                icon: () => <Icon name="left" class={s.navIcon}/>,
                default: () => <>
                    {/*<Tabs selected={refKind.value} onUpdateSelected={name => refKind.value = name}>*/}
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={refKind.value} class={s.tabs}>
                            <Tab name="支出" class={s.tags_wrapper}>
                                <div class={s.tag}>
                                    <div class={s.sign}>
                                        <Icon name="add" class={s.createTag}/>
                                    </div>
                                    <div class={s.name}>
                                        新增
                                    </div>
                                </div>
                                {refExpensesTags.value.map(tag =>
                                    <div class={[s.tag, s.selected]}>
                                        <div class={s.sign}>
                                            {tag.sign}
                                        </div>
                                        <div class={s.name}>
                                            {tag.name}
                                        </div>
                                    </div>
                                )}
                            </Tab>
                            <Tab name="收入" class={s.tags_wrapper}>
                                <div class={s.tag}>
                                    <div class={s.sign}>
                                        <Icon name="add" class={s.createTag}/>
                                    </div>
                                    <div class={s.name}>
                                        新增
                                    </div>
                                </div>
                                {refIncomeTags.value.map(tag =>
                                    <div class={[s.tag, s.selected]}>
                                        <div class={s.sign}>
                                            {tag.sign}
                                        </div>
                                        <div class={s.name}>
                                            {tag.name}
                                        </div>
                                    </div>
                                )}
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            <InputPad/>
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})