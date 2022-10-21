import {defineComponent, onUpdated, PropType, ref} from 'vue';
import s from './ItemCreate.module.scss';
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";
import {Tab, Tabs} from "../../shared/Tabs";
import {InputPad} from "./InputPad";


export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refKind = ref('支出')
        const refExpensesTags = ref([
            {id: 1, name: '餐饮', sign: '￥', category: 'expenses'},
            {id: 2, name: '打车', sign: '￥', category: 'expenses'},
            {id: 3, name: '地铁', sign: '￥', category: 'expenses'},
            {id: 4, name: '公交', sign: '￥', category: 'expenses'},
            {id: 5, name: '房租', sign: '￥', category: 'expenses'},
            {id: 6, name: '游玩', sign: '￥', category: 'expenses'},
            {id: 7, name: '聚餐', sign: '￥', category: 'expenses'},
            {id: 8, name: '购物', sign: '￥', category: 'expenses'},
            {id: 9, name: '生活', sign: '￥', category: 'expenses'},
            {id: 10, name: '公益', sign: '￥', category: 'expenses'},
            {id: 11, name: '保险', sign: '￥', category: 'expenses'},
            {id: 12, name: '医疗', sign: '￥', category: 'expenses'},
            {id: 13, name: '宠物', sign: '￥', category: 'expenses'},
            {id: 14, name: '还款', sign: '￥', category: 'expenses'},
            {id: 15, name: '游戏', sign: '￥', category: 'expenses'},
        ])
        const refIncomeTags = ref([
            {id: 16, name: '工资', sign: '￥', category: 'income'},
            {id: 17, name: '彩票', sign: '￥', category: 'income'},
            {id: 18, name: '基金', sign: '￥', category: 'income'},
            {id: 19, name: '债券', sign: '￥', category: 'income'},
            {id: 20, name: '定期', sign: '￥', category: 'income'},
            {id: 21, name: '外汇', sign: '￥', category: 'income'},
            {id: 22, name: '股票', sign: '￥', category: 'income'},
            {id: 23, name: '贵金属', sign: '￥', category: 'income'},
            {id: 24, name: '虚拟货币', sign: '￥', category: 'income'},
            {id: 25, name: '转账', sign: '￥', category: 'income'},
            {id: 16, name: '红包', sign: '￥', category: 'income'},
        ])
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