import { useQuery } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';

const fetchListFromAPI = ({ url, method, data }) => {
    return fetchWrapper(url, { method: method, body: data });
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
    return { data, isSuccess, isError, isLoading, error };
}