import {defineComponent} from "vue";


export const FloatButton = defineComponent({
    setup: (props, context) => {
        return () => (
            <div>
                <svg>
                    <use xlinkHref='#add'></use>
                </svg>
            </div>
        )
    }
})