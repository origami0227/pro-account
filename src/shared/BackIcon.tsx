import { defineComponent, PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from './Icon';
export const BackIcon = defineComponent({
    setup: (props, context) => {
        const route = useRoute(); //通过route拿到return_to
        const router = useRouter(); //引入router
        const onClick = () => {
            const { return_to } = route.query; //从route的参数里面拿到return_to
            if (return_to) {
                //如果return_to存在 就返回到return_to这一页
                router.push(return_to.toString());
            } else {
                //否则直接退回上一层
                router.back();
            }
        };
        return () => <Icon name="left" onClick={onClick} />;
    },
});