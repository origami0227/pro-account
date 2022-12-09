import {defineComponent, reactive} from 'vue';
import {MainLayout} from '../../layouts/MainLayout';
import {Button} from '../../shared/Button';
import s from './Tag.module.scss';
import {TagForm} from './TagForm';
import {BackIcon} from "../../shared/BackIcon";
import {useRoute, useRouter} from "vue-router";
import {http} from "../../shared/Http";
import {Dialog} from "vant";

export const TagEdit = defineComponent({
    setup: (props, context) => {
        const route = useRoute()
        const numberId = parseInt(route.params.id!.toString())//断言有id能够传过去
        if (Number.isNaN(numberId)) {
            //如果失败了就返回不存在
            return () => <div>id 不存在</div>
        }
        const router = useRouter()
        const onError = () => {
            Dialog.alert({title: '提示', message: '删除失败'})
        }
        const onDelete = async (options?: { withItems?: Boolean }) => {
            await Dialog.confirm({
                title: '确认',
                message: '你真的要删除吗？'
            })
            await http
                .delete(`/tags/${numberId}`, {
                    with_items: options?.withItems ? 'true' : 'false',
                }, {_autoLoading: true})
                .catch(onError)
            router.back()
        }
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <BackIcon/>,
                default: () => <>
                    <TagForm id={numberId}/>
                    <div class={s.actions}>
                        <Button level='danger' class={s.removeTagsAndItems}
                                onClick={() => onDelete({withItems: true})}>删除标签（对应记账信息也会删除）</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})
export default TagEdit