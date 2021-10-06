import { useQuery } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';

const fetchListFromAPI = async (url) => {
    const res = fetchWrapper(url, {})
    return res;
}

export default function useQueryWrapper(queryName, url) {
    const { data, status } = useQuery(queryName, () => fetchListFromAPI(url));
    return { data, status };
}