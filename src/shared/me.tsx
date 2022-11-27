import {http} from "./Http";
import {AxiosResponse} from "axios";

export let mePromise: Promise<AxiosResponse<Resource<User>>> | undefined
export const refreshMe = () => {
    mePromise = http.get<Resource<User>>('/me')//更新请求
    return refreshMe
}
export const fetchMe = refreshMe