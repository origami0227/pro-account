import {onMounted, ref} from "vue";
import {http} from "./Http";
import {AxiosResponse} from "axios";

type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>
export const useTags = (fetcher: Fetcher) => {
    const page = ref(0) //标记当前第几页 还没有请求的时候默认第0页
    const hasMore = ref(false)//标记是否含有更多页
    const tags = ref<Tag[]>([])
    //请求封装 获取Tags
    const fetchTags = async () => {
        const response = await fetcher(page.value)
        const {resources, pager} = response.data
        tags.value.push(...resources)//避免覆盖，选择push
        hasMore.value = (pager.page - 1) * pager.per_page + resources.length < pager.count
        page.value += 1
    }
    // @ts-ignore
    onMounted(fetchTags)
    return {
        page, hasMore, tags, fetchTags
    }
}