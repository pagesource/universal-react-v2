import useQueryWrapper from "./ReactQuery";
import ClipLoader from "react-spinners/ClipLoader";

// Example use of ReactQuery 
export default function GetTestComponent() {
    // Example of GET request
    const { data, isSuccess, isLoading } = useQueryWrapper({ queryKey: 'People', url: "https://gorest.co.in/public/v1/users" });
    return (
        <>
            <ClipLoader color="#339FFF" loading={isLoading} css={` display: block; margin: 0 auto;`} size={150} />
            <div style={{ display: 'flex', width: "100%", marginTop: "50px", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                {
                    isSuccess && data["data"].map((item) =>
                        <div style={{ padding: '10px', borderRadius: "8px", width: "60%", background: "#339FFF", marginBottom: "20px" }}>
                            <strong>Name: {item.name}</strong>
                            <p>Gender: {item.gender}</p>
                            <p>Status: {item.status}</p>
                        </div>
                    )
                }
            </div>
        </>
    );
}

