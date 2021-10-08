import { useQuery } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';

const fetchListFromAPI = async (url) => {
    // add method and data
    const res = fetchWrapper(url, {})
    return res;
}

export default function useQueryWrapper(queryOptions) {
    const {
        queryKey = "query",
        url
    } = queryOptions || {};

    const { data, isSuccess, isError, isFetching, isLoading, error } = useQuery(queryKey, () => fetchListFromAPI(url));
    if (isError) console.log(`Error: ${error}`);
    return { data, isSuccess, isError, isFetching, isLoading, error };
}