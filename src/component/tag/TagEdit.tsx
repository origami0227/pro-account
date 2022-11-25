import { defineComponent, reactive } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';
import { TagForm } from './TagForm';
import {BackIcon} from "../../shared/BackIcon";
import {useRoute} from "vue-router";
export const TagEdit = defineComponent({
    setup: (props, context) => {
        const route = useRoute()
        const numberId = parseInt(route.params.id!.toString())//断言有id能够传过去
        if(Number.isNaN(numberId)){
            //如果失败了就返回不存在
            return ()=> <div>id 不存在</div>
        }
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <BackIcon />,
                default: () => <>
                    <TagForm id={numberId} />
                    <div class={s.actions}>
                        <Button level='danger' class={s.removeTags} onClick={() => { }}>删除标签</Button>
                        <Button level='danger' class={s.removeTagsAndItems} onClick={() => { }}>删除标签和记账</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})