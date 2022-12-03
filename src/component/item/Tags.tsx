import {defineComponent, onUpdated, PropType, ref} from 'vue';
import {Button} from '../../shared/Button';
import {http} from '../../shared/Http';
import {Icon} from '../../shared/Icon';
import {useTags} from '../../shared/useTags';
import s from './Tags.module.scss';
import {RouterLink, useRouter} from 'vue-router';

export const Tags = defineComponent({
    props: {
        kind: {
            type: String as PropType<string>,
            required: true
        },
        selected: Number,
    },
    emits: ['update:selected'],
    setup: (props, context) => {
        const {tags, hasMore, page, fetchTags} = useTags((page) => {
            return http.get<Resources<Tag>>('/tags', {
                kind: props.kind,
                page: page + 1,
            },{
                _mock: 'tagIndex',
                _autoLoading: true,
            })
        })
        const onSelect = (tag: Tag) => {
            context.emit('update:selected', tag.id)
        }
        const timer = ref<number>() //定义计时器
        const currentTag = ref<HTMLDivElement>() //标记鼠标所指向的标签
        const router = useRouter();
        const onLongPress = (tagId: Tag['id']) => {
            //声明长按事件,跳转
            router.push(`/tags/${tagId}/edit?kind=${props.kind}`) //跳转到对应id
        }
        const onTouchStart = (e: TouchEvent, tag: Tag) => {
            currentTag.value = e.currentTarget as HTMLDivElement //标记开始时指向的元素
            timer.value = setTimeout(() => {
                onLongPress(tag.id) //一秒后触发 长按事件
            }, 1000)
        }
        const onTouchEnd = (e: TouchEvent) => {
            //end的时候重置timer
            clearTimeout(timer.value)
        }
        const onTouchMove = (e: TouchEvent) => {
            //获取手指当前所指向的元素
            const pointedElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
            //范围判断=> 如果出了范围 那么就重置timer
            if (currentTag.value !== pointedElement &&
                currentTag.value?.contains(pointedElement) === false) {
                clearTimeout(timer.value)
            }
        }

        return () => <>
            <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
                <RouterLink to={`/tags/create?kind=${props.kind}`} class={s.tag}>
                    <div class={s.sign}>
                        <Icon name="add" class={s.createTag}/>
                    </div>
                    <div class={s.name}>新增</div>
                </RouterLink>
                {tags.value.map(tag =>
                    <div class={[s.tag, props.selected === tag.id ? s.selected : '']}
                         onClick={() => onSelect(tag)}
                         onTouchstart={(e)=>onTouchStart(e, tag)}
                         onTouchend={onTouchEnd}>
                        <div class={s.sign}>
                            {tag.sign}
                        </div>
                        <div class={s.name}>
                            {tag.name}
                        </div>
                    </div>
                )}
            </div>
            <div class={s.more}>
                {hasMore.value ?
                    <Button class={s.loadMore} onClick={fetchTags}>加载更多</Button> :
                    <span class={s.noMore}>没有更多</span>
                }
            </div>
        </>
    }
})