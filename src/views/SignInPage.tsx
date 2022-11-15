import {defineComponent, PropType, reactive, ref} from 'vue';
import {MainLayout} from '../layouts/MainLayout';
import {Button} from '../shared/Button';
import {Form, FormItem} from '../shared/Form';
import {Icon} from '../shared/Icon';
import {validate} from '../shared/validate';
import s from './SignInPage.module.scss';
import axios, { AxiosResponse } from "axios";
import { http } from '../shared/Http';

export const SignInPage = defineComponent({
    setup: (props, context) => {
        const formData = reactive({
            email: '1071242996@qq.com',
            code: ''
        })
        const errors = reactive({
            email: [],
            code: []
        })
        const refValidationCode = ref<any>('')
        const onSubmit = (e: Event) => {
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
        }
        const onError = (error: any) => {
            if (error.response.status === 422) {
                Object.assign(errors, error.response.data.errors)
            }
            throw error
        }
        const onClickSendValidationCode = async () => {
            //使用axios来发送请求，请求结果使用await，注意使用await需要在函数async中进行
            const response = await http.post('/validation_codes', {email: formData.email})
                .catch(onError)
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
                            <Form onSubmit={onSubmit}>
                                <FormItem label="邮箱地址" type="text"
                                          error={errors.email?.[0]}
                                          placeholder="请输入邮箱，然后点击发送验证码"
                                          v-model={formData.email}/>
                                <FormItem label="验证码" type="validationCode"
                                          ref={refValidationCode}
                                          countFrom={1}
                                          placeholder="请输入六位数字"
                                          error={errors.code?.[0]}
                                          onClick={onClickSendValidationCode}
                                          v-model={formData.code}/>
                                <FormItem style={{paddingTop: '48px'}}>
                                    <Button>登陆/注册</Button>
                                </FormItem>
                            </Form>
                        </div>
                    )
                }
            }</MainLayout>
        )
    }
})