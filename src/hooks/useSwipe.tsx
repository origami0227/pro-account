import {computed, onMounted, onUnmounted, ref, Ref} from "vue";

type Point = { x: number; y: number }//声明一个类型 '点' 内容是x和y的坐标
export const useSwipe = (element: Ref<HTMLElement | null>) => {
    const start = ref<Point>()//记录start 和 end 坐标
    const end = ref<Point>()
    const swiping = ref<Boolean>(false)//是否处于正常的移动状态
    const distance = computed(() => {
        if(!swiping) {return ''}
        if (!start.value || !end.value) {return null}
        return {
            x: end.value.x - start.value.x,
            y: end.value.y - start.value.y
        }
    })//距离变量 （计算属性）
    const direction = computed(() => {
        if (!distance.value) return ''//如果为空就没有方向
        const {x, y} = distance.value
        if (Math.abs(x) > Math.abs(y)) {//如果x的绝对值大，那么就认为是x轴上的方向
            return x > 0 ? 'right' : 'left'
        } else {
            return y > 0 ? 'down' : 'up'//反之亦然
        }
    })//方向变量（计算属性）
    onMounted(() => {
        element.value?.addEventListener('touchstart', e => {
            start.value = {
                x: e.touches[0].clientX,//手指基 于文档的位置
                y: e.touches[0].clientY,
            }
            end.value = undefined//先置空 按下之后才会记录end的坐标
            swiping.value = true //移动了就让他为true
        })
        element.value?.addEventListener('touchmove', e => {
            end.value = {
                x: e.touches[0].clientX,//手指基 于文档的位置
                y: e.touches[0].clientY,
            }//移动时记录end的坐标
        })
        element.value?.addEventListener('touchend', e => {
            swiping.value = false //结束就不记录移动

        })

    })//挂在之后监听
    return {
        swiping,distance,direction,start,end
    }
}