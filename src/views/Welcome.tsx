import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import s from './Welcome.module.scss'
import logo from '../assets/icons/kabi.svg'
export const welcome = defineComponent({
  setup: (props, context) => {
    return () => (
        <div class={s.wrapper}>
          <header>
              <img class={s.logo} src={logo} />
              <h1>卡比记账</h1>
          </header>
          <main class={s.main}>
            <RouterView />
          </main>
        </div>

    )
  },
})
