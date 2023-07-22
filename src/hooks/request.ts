import { ref, UnwrapRef } from 'vue'
import { AxiosResponse } from 'axios'
import { HttpResponse } from '@/api/requestHttp/interceptor'
import useLoading from './loading'

// use to fetch List
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(null, {}))

export default function useRequest<T>(
    api: () => Promise<AxiosResponse<HttpResponse>>,
    defaultValue = [] as unknown as T,
    loading = true
) {
    const { isLoading, setLoading } = useLoading(loading)
    const response = ref<T>(defaultValue)
    api()
        .then((res) => {
            response.value = res.data as unknown as UnwrapRef<T>
        })
        .finally(() => {
            setLoading(false)
        })
    return { isLoading, response }
}
