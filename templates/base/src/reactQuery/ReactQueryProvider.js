import ReactQuery from './ReactQuery';
import { QueryClientProvider, QueryClient } from 'react-query';
const queryClient = new QueryClient()

export default function ReactQueryProvider({ children }) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQuery>
                </ReactQuery>
            </QueryClientProvider>
            {children}
        </>
    );
}