import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query'


const fetchListFromAPI = async () => {
    const res = await fetch('https://swapi.dev/api/people/');
    return res.json();
}

export default function ReactQuerySample({ children }) {
    const queryClient = useQueryClient();
    const { data, status } = useQuery("people", fetchListFromAPI);
    console.log("data", data);
    console.log("status", status)


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
            {children}
        </>
    );
}
