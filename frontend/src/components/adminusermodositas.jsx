import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';


export default function AdminUser( {accessToken}){
    const [osszesUser, setOsszesUser] = useState([])
    const [jelenlegi_admin_email, setJelenlegi_admin_email] = useState("")

    const fetchData = async () => {
        try {
            const response = await httpCommon.get("/admin/adminuser", {
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
            const response = await httpCommon.put("/admin/adminuserdelete", 
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
            const response = await httpCommon.put("/admin/updatejogosultsag", 
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
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await httpCommon.get("/konyvek/profil", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setJelenlegi_admin_email(response.data.email);
        console.log(jelenlegi_admin_email)

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (accessToken) fetchEmail();
  }, [accessToken]);

    return(
        <>
        {osszesUser.map((U, index) =>(
            
            jelenlegi_admin_email !== U.email &&(
            <div className="order" key={index}>
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
            )
        ))}
        </>
    )
}