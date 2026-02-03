import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';


export default function AdminUser( {accessToken}){
    const [osszesUser, setOsszesUser] = useState([])

    const fetchData = async () => {
        try {
            const response = await httpCommon.get("/konyvek/adminuser", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setOsszesUser(response.data)
        } catch (err) {
            console.error(err)
        }
    }

   useEffect(() => {
    if (accessToken) {
        fetchData()  
    }

    
}, [accessToken])

const usertorles = async (email) =>{
        try{
            const response = await httpCommon.put("/konyvek/adminuserdelete", 
                { email },
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            fetchData()
        }
        catch (err) {
            console.error(err)
        }
}

const jogosultsagupdate = async (email,jogosultsag) =>{
        try{
            const response = await httpCommon.put("/konyvek/updatejogosultsag", 
                { email, jogosultsag },
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })

            fetchData()
        }
        catch (err) {
            console.error(err)
        }
}

    return(
        <>
        {osszesUser.map((U, index) =>(
            <div className="order">
            <span style={{marginBottom:"10px"}}>Username: {U.vevo_nev}<br/> 
            Lakcím: {U.lakcim ? U.lakcim : "Nincs felvett adat"} <br/> 
            Email: {U.email} <br/> 
            Adószám: {U.adoszam ? U.adoszam : "Nincs felvett adat"} <br/> 
            Jogosultság:  {U.jogosultsag === 1 ? "Felhasználó" : U.jogosultsag === 2 ? "Admin" : "TÖRÖLT"} <br/>
            <div style={{marginTop:"10px"}}>
            <Button className="clear-filters-btn" style={{marginRight:"15px"}} onClick={() => usertorles(U.email)}>Felhasználó törlése</Button>
            <Button className="apply-filters-btn" onClick={() => jogosultsagupdate(U.email,2)}>Admin jogosultság</Button>
            <Button className="apply-filters-btn" onClick={() => jogosultsagupdate(U.email,1)}>User jogosultsag</Button>
            </div>
            </span>

            </div>
        ))}
        </>
    )
}