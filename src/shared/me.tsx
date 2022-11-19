import {http} from "./Http";
import {AxiosResponse} from "axios";

export let mePromise: Promise<AxiosResponse<{
    resource: {
        id: number;
    };
}>> | undefined
export const refreshMe = () => {
    mePromise = http.get<{ resource: { id: number } }>('/me')//更新请求
    return refreshMe
}
export const fetchMe = refreshMe