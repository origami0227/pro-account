import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
export const welcome = defineComponent({
  setup: (props, context) => {
    return () => (
      <div>
        <Router-view />
      </div>
    )
  },
})
