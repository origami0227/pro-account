import {defineComponent, onMounted, PropType, reactive, toRaw} from 'vue';
import {Button} from '../../shared/Button';
import {hasError, Rules, validate} from '../../shared/validate';
import s from './Tag.module.scss';
import {Form, FormItem} from '../../shared/Form';
import {useRoute, useRouter} from "vue-router";
import {http} from "../../shared/Http";
import {onFormError} from "../../shared/onFormError";

export const TagForm = defineComponent({
    props: {
        id: Number,
    },
    setup: (props, context) => {
        const route = useRoute(); //在useRouter中获取kind字段
        const formData = reactive<Partial<Tag>>({
            id: undefined, //增加id字段 默认undefined
            kind: route.query.kind!.toString(), //获取kind字段
            name: '',
            sign: '',
        })
        const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({})
        const router = useRouter()
        const onSubmit = async (e: Event) => {
            e.preventDefault()
            const rules: Rules<typeof formData> = [
                {key: 'name', type: 'required', message: '必填'},
                {key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填 1 到 4 个字符'},
                {key: 'sign', type: 'required', message: '必填'},
            ]
            Object.assign(errors, {
                name: [],
                sign: [],
            })
            Object.assign(errors, validate(formData, rules))
            if (!hasError((errors))) {
                const promise = await formData.id ?
                    http.patch(`/tags/${formData.id}`, formData, {
                        _mock: 'tagEdit',
                    }) :
                    http.post('/tags', formData, {
                        _mock: 'tagCreate',
                    })
                await promise.catch((error) =>
                    onFormError(error, (data) =>
                        Object.assign(errors, data.errors)//把得到的error赋值到本身的errors中
                    )
                )
                router.back()//成功后返回
            }
        }
        onMounted(async () => {
            //挂在之后 对是否传id进行判断
            if (!props.id) {
                return
            }
            const response = await http.get<Resource<Tag>>(`/tags/${props.id}`, {
            },{
                _mock: 'tagShow'
            })
            Object.assign(formData, response.data.resource)
        })
        return () => (
            <Form onSubmit={onSubmit}>
                <FormItem label='标签名（最多4个字符）'
                          type="text"
                          v-model={formData.name}
                          error={errors['name']?.[0]}/>
                <FormItem label={'符号 ' + formData.sign}
                          type="emojiSelect" v-model={formData.sign}
                          error={errors['sign']?.[0]}/>
                <FormItem>
                    <p class={s.tips}>记账时长按标签即可进行编辑</p>
                </FormItem>
                <FormItem>
                    <Button type="submit" class={[s.button]}>确定</Button>
                </FormItem>
            </Form>
        )
    }
})