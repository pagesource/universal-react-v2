import { useQuery } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';

const fetchListFromAPI = async (url, method, data) => {
    // add method and data
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
    const { data, isSuccess, isError, isFetching, isLoading, error } = useQuery(queryKey, () => fetchListFromAPI(url, method, queryData));
    if (isError) console.log(`Error: ${error}`);
    return { data, isSuccess, isError, isFetching, isLoading, error };
}