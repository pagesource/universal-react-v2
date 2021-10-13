import { useQuery, useQueryClient } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';

const fetchListFromAPI = ({ url, method, data }) => {
    const res = fetchWrapper(url, { method: method, body: data })
    return res;
}

export default function useQueryWrapper(queryOptions) {
    const {
        queryKey = "query",
        url,
        method,
        queryData
    } = queryOptions || {};
    const { data, isSuccess, isError, isLoading, error } = useQuery(queryKey, () => fetchListFromAPI({ url: url, method: method, data: queryData }));
    if (isError) console.log(`Error: ${error}`);
    const queryClient = useQueryClient();
    console.log("QueryClient info:");
    console.log(queryClient);
    return { data, isSuccess, isError, isLoading, error };
}