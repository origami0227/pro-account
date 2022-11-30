import {AxiosError} from 'axios'
import {Dialog} from 'vant'
import {defineComponent, onMounted, PropType, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {MainLayout} from '../../layouts/MainLayout'
import {BackIcon} from '../../shared/BackIcon'
import {Button} from '../../shared/Button'
import {http} from '../../shared/Http'
import {Icon} from '../../shared/Icon'
import {Tabs, Tab} from '../../shared/Tabs'
import {useTags} from '../../shared/useTags'
import {hasError, validate} from '../../shared/validate'
import {InputPad} from './InputPad'
import s from './ItemCreate.module.scss'
import {Tags} from './Tags'


export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const formData = reactive({
            kind: 'expenses', //kind字段默认支出
            tag_ids: [], //tagId默认一个数组
            amount: 0, //金额 amount默认0
            happen_at: new Date().toISOString(), //默认是当前时间并且转化为iso字符串
        })
        const errors = reactive<FormErrors<typeof formData>>({
            kind: [],
            tag_ids: [],
            amount: [],
            happen_at: []
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

        // const onSubmit = async () => {
        //     //由于之前我们请求中的kind发出的是中文不符合后端标准 所以会返回状态码500
        //     //要进行一个对象的映射 让中文改成英文
        //     const kindMap: Record<string, string> = {
        //         '支出': 'expenses',
        //         '收入': 'income',
        //     }
        //     await http.post<Resource<Item>>('/items', {...formData, kind: kindMap[formData.kind]},
        //         {_mock: 'itemCreate',_autoLoading:true}
        //     ).catch(onError)
        //     router.push("/items")
        // }
        const onSubmit = async () => {
            Object.assign(errors, {kind: [], tag_ids: [], amount: [], happen_at: []})
            Object.assign(errors, validate(formData, [
                {key: 'kind', type: 'required', message: '类型必填'},
                {key: 'tag_ids', type: 'required', message: '标签必填'},
                {key: 'amount', type: 'required', message: '金额必填'},
                {key: 'amount', type: 'notEqual', value: 0, message: '金额不能为零'},
                {key: 'happen_at', type: 'required', message: '时间必填'},
            ]))
            if (hasError(errors)) {
                Dialog.alert({
                    title: '出错',
                    message: Object.values(errors).filter(i => i.length > 0).join('\n')
                })
                return
            }
            await http.post<Resource<Item>>('/items', formData, {
                _mock: 'itemCreate',
                _autoLoading: true
            }).catch(onError)
            router.push('/items')
        }
        return () => (
            <MainLayout class={s.layout}>
                {{
                    title: () => '记一笔',
                    icon: () => <BackIcon/>,
                    default: () => (
                        <>
                            <div class={s.wrapper}>
                                <Tabs v-model:selected={formData.kind} class={s.tabs}>
                                    <Tab value="expenses" name="支出">
                                        <Tags kind="expenses" v-model:selected={formData.tag_ids![0]}/>
                                    </Tab>
                                    <Tab value="income" name="收入">
                                        <Tags kind="income" v-model:selected={formData.tag_ids![0]}/>
                                    </Tab>
                                </Tabs>
                                <div class={s.inputPad_wrapper}>
                                    <InputPad
                                        v-model:happenAt={formData.happen_at}
                                        v-model:amount={formData.amount}
                                        onSubmit={onSubmit}
                                    />
                                </div>
                            </div>
                        </>
                    )
                }}
            </MainLayout>
        )
    }
})