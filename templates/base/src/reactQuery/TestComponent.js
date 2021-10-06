import useQueryWrapper from "./ReactQuery";

// Sample use of ReactQuery 
export default function TestComponent() {
    const { data, status } = useQueryWrapper("People", "https://swapi.dev/api/people/");
    return (
        <>
            <div style={{ display: 'flex', width: "100%", marginTop: "50px", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                {
                    status === "success" && data.results.map((item) =>
                        <div style={{ padding: '10px', borderRadius: "8px", width: "60%", background: "#339FFF", marginBottom: "20px" }}>
                            <strong>Name: {item.name}</strong>
                            <p>Gender: {item.gender}</p>
                            <p>Height: {item.height}</p>
                        </div>
                    )
                }
            </div>
        </>
    );
}

