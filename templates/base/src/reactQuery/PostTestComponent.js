import useQueryWrapper from "./ReactQuery";
import ClipLoader from "react-spinners/ClipLoader";

// Example use of ReactQuery 
export default function PostTestComponent() {
    // Example of POST request
    const { isSuccess, isLoading } = useQueryWrapper({ queryKey: 'People', url: "https://httpbin.org/post", data: { "name": "React Query" }, method: 'POST' });

    return (
        <>
            <ClipLoader color="#339FFF" loading={isLoading} css={` display: block; margin: 0 auto;`} size={150} />
            <div style={{ display: 'flex', width: "100%", marginTop: "50px", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                {
                    isSuccess &&
                    <div style={{ padding: '10px', borderRadius: "8px", width: "60%", background: "#339FFF", marginBottom: "20px" }}>
                        <strong>Data successfully posted!</strong>
                    </div>
                }
            </div>
        </>
    );
}

