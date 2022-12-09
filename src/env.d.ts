/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare var DEBUG: boolean

type JSONValue = null | boolean | string | number | JSONValue[] | Record<string, JSONValue>
type Tag = { //声明Tag类型
  id: number,
  user_id: number,
  name: string,
  sign: string,
  kind: 'expenses' | 'income'
}
type Resources<T = any> = { //声明Resource类型 T写在前面
  //它有两个字段 一个是resources 另一个是分页pager
  resources: T[] //是一个数组 但不知道是什么数组用T来占位
  pager: {
    page: number,
    per_page: number,
    count: number
  }
}
type Item = {
  id: number
  user_id: number
  amount: number
  tag_ids: number[]
  tags?: Tag[],
  happen_at: string
  kind: 'expenses' | 'income'
}
type Resource<T> = {
  resource: T
}

type ResourceError = {
  errors: Record<string, string[]>
}
type User = {
  id: number;
  email: string;
}
type FormErrors<T> = {[K in keyof typeof T]: string[]}