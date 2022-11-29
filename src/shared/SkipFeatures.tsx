import { defineComponent, PropType } from 'vue';
import { RouteLocationRaw, RouterLink } from 'vue-router';
export const SkipFeatures = defineComponent({
    setup: (props, context) => {
        const onClick = () => {
            localStorage.setItem('skipFeatures', 'yes')//标记
        }
        return () => (
            <span onClick={onClick}>
        <RouterLink to="/items">跳过</RouterLink>
      </span>
        )
    }
})