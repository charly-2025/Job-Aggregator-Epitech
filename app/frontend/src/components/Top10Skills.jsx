import { useState,useEffect } from "react";

export default function top10Skills({userSkills,refreshAccessToken}) {
    const [listTop10Skills,setListTop10Skills] = useState([])
    
    useEffect(()=>{
    async function getTop10Skills(retry=false) {
    try {
            const response = await fetch('http://localhost:3001/api/skills/top10Skills', {
                method: "PUT",
                credentials: "include",
            });
            if (response.status === 401 && !retry) {
                refreshAccessToken();
                return getTop10Skills(true);
            }
            return response.json()
        } catch (err) {
            console.error(err);
        }
    }
    setListTop10Skills(getTop10Skills())
    },[])
    

    return(
        <div>
            <div className="top10Skills-global-score"></div>
            <div className="top10Skills-score"></div>
        </div>
    );
}