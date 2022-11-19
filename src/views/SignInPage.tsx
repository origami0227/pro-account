import {defineComponent, PropType, reactive, ref} from 'vue';
import {MainLayout} from '../layouts/MainLayout';
import {Button} from '../shared/Button';
import {Form, FormItem} from '../shared/Form';
import {Icon} from '../shared/Icon';
import {validate, hasError} from '../shared/validate';
import s from './SignInPage.module.scss';
import {http} from '../shared/Http';
import {useBool} from '../hooks/useBool';
import {useRoute, useRouter} from "vue-router";
import { refreshMe } from '../shared/me';

export const SignInPage = defineComponent({
    setup: (props, context) => {
        const formData = reactive({
            email: '',
            code: ''
        })
        const errors = reactive({
            email: [],
            code: []
        })
        const router = useRouter()
        const route = useRoute()
        const refValidationCode = ref<any>('')
        const {ref: refDisabled, toggle, on: disabled, off: enable} = useBool(false)
        const onSubmit = async (e: Event) => {
            console.log('submit')
            e.preventDefault()
            Object.assign(errors, {
                email: [], code: []
            })
            Object.assign(errors, validate(formData, [
                {key: 'email', type: 'required', message: '必填'},
                {key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址'},
                {key: 'code', type: 'required', message: '必填'},
            ]))
            if (!hasError(errors)) {
                const response = await http.post<{ jwt: string }>('/session', formData)
                localStorage.setItem('jwt', response.data.jwt)
                //使用查询参数的思路
                // await router.push('/sign_in?return_to'+encodeURIComponent(route.fullPath))//设置return_to
                const returnTo = route.query.return_to?.toString() //因为地址栏一般不用答谢所以改成下划线，query后面接字符串就可以
                refreshMe()
                await router.push(returnTo || '/')

                //使用localStorage的思路

                // const returnTo = localStorage.getItem('returnTo')//'returnTo是字符串可能为空所以进行一个判断'
                // await router.push(returnTo || '/')//简写下方代码
                // if(returnTo){
                //    await router.push(returnTo)//跳转回当前页面
                // }else{//如果为空则跳转到首页
                //    await router.push('/')
                // }
                // history.push('/')//只会替换地址栏 需要用router

            }
        }
        const onError = (error: any) => {
            if (error.response.status === 422) {
                Object.assign(errors, error.response.data.errors)
            }
            throw error
        }
        const onClickSendValidationCode = async () => {
            disabled()//先禁用
            //使用axios来发送请求，请求结果使用await，注意使用await需要在函数async中进行
            const response = await http.post('/validation_codes', {email: formData.email})
                .catch(onError)
                .finally(enable)//取消禁用
            //发送成功
            console.log(response)
            refValidationCode.value.startCount()//成功后调用FormItem暴露出来的startCount
        }
        return () => (
            <MainLayout>{
                {
                    title: () => '登录',
                    icon: () => <Icon name="left"/>,
                    default: () => (
                        <div class={s.wrapper}>
                            <div class={s.logo}>
                                <Icon class={s.icon} name="kabi"/>
                                <h1 class={s.appName}>卡比记账</h1>
                            </div>
                            {/*<div>{JSON.stringify(formData)}</div>*/}
                            <Form onSubmit={onSubmit}>
                                <FormItem label="邮箱地址" type="text"
                                          error={errors.email?.[0]}
                                          placeholder="请输入邮箱，然后点击发送验证码"
                                          v-model={formData.email}/>
                                <FormItem label="验证码" type="validationCode"
                                          ref={refValidationCode}
                                          countFrom={1}
                                          disabled={refDisabled.value}
                                          placeholder="请输入六位数字"
                                          error={errors.code?.[0]}
                                          onClick={onClickSendValidationCode}
                                          v-model={formData.code}/>
                                <FormItem style={{paddingTop: '48px'}}>
                                    <Button type="submit">登录/注册</Button>
                                </FormItem>
                            </Form>
                        </div>
                    )
                }
            }</MainLayout>
        )
    }
})