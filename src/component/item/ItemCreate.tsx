import {defineComponent, onMounted, onUpdated, PropType, reactive, ref} from 'vue';
import s from './ItemCreate.module.scss';
import {MainLayout} from "../../layouts/MainLayout";
import {Icon} from "../../shared/Icon";
import {Tab, Tabs} from "../../shared/Tabs";
import {InputPad} from "./InputPad";
import {Tags} from "./Tags";
import {http} from "../../shared/Http";
import {useRouter} from "vue-router";
import {AxiosError} from "axios";
import {Dialog} from "vant";


export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const formData = reactive({
            kind: '支出', //kind字段默认支出
            tags_id: [], //tagId默认一个数组
            amount: 0, //金额 amount默认0
            happen_at: new Date().toISOString(), //默认是当前时间并且转化为iso字符串
        })
        const router = useRouter()
        // const refKind = ref('支出') //标记支出收入的tab
        // const refTagId = ref<number>() //标记tag 传给后端一个id
        // const refHappenAt = ref<string>(new Date().toISOString()) //标记记账事件发生时间
        // const refAmount = ref<number>(0)//标记记账金额，默认为0
        const onError = (error: AxiosError<ResourceError>) => {
            if (error.response?.status === 422) {
                Dialog.alert({
                    title: '出错',
                    message: Object.values(error.response.data.errors).join('\n')
                })
            }
            throw error
        }
        const onSubmit = async () => {
            //由于之前我们请求中的kind发出的是中文不符合后端标准 所以会返回状态码500
            //要进行一个对象的映射 让中文改成英文
            const kindMap: Record<string, string> = {
                '支出' : 'expenses',
                '收入' : 'income',
            }
            await http.post<Resource<Item>>('/items', {...formData,kind:kindMap[formData.kind]},
                {params: {_mock: 'itemCreate'}}
            ).catch(onError)
            router.push("/items")
        }
        return () => (
            <MainLayout class={s.layout}>{{
                title: () => '记一笔',
                icon: () => <Icon name="left" class={s.navIcon}/>,
                default: () => <>
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={formData.kind} class={s.tabs}>
                            <Tab name="支出">
                                <Tags kind="expenses" v-model:selected={formData.tags_id[0]}/>
                            </Tab>
                            <Tab name="收入">
                                <Tags kind="income" v-model:selected={formData.tags_id[0]}/>
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            {/*<div>{refHappenAt.value}</div>*/}
                            <InputPad
                                onSubmit={onSubmit}
                                v-model:happenAt={formData.happen_at}
                                v-model:amount={formData.amount}/>
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})