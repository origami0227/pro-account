import {defineComponent, reactive, ref} from 'vue';
import {Charts} from "../component/statistics/Charts";
import {TimeTabsLayout} from "../layouts/TimeTabsLayout";


export const StatisticsPage = defineComponent({
    setup: (props, context) => {
        return () => (
            <TimeTabsLayout component={Charts}/>
        )
    }
})