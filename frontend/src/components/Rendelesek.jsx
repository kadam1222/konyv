import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import "./rendelesek.css"

export default function Rendelesek({accessToken, setAccessToken}){
    const [rendeleseim, setRendeleseim] = useState([]);
    useEffect (() =>{
        const fetchData = async() =>{
        try{
           const response = await httpCommon.get("/konyvek/rendelesek", {
            headers: {
                Authorization: `Bearer ${accessToken}`, 

            }
            });
            setRendeleseim(response.data)
        }
        catch(err){
            console.error("Error fetching data:", err);
        }
    }
    fetchData();
    }, [accessToken]);

    const groupedOrdersMap = new Map();

    rendeleseim.forEach(row => {
    const { szamlaszam, szamla_id, cim, darab, fizetesi_hatarido, fizetesi_mod, szallitasi_mod, vegosszeg } = row;

    if (!groupedOrdersMap.has(szamlaszam)) {
        groupedOrdersMap.set(szamlaszam, {
        szamla_id,
        szamlaszam,
        fizetesi_hatarido,
        fizetesi_mod,
        szallitasi_mod,
        vegosszeg,
        books: []
        });
    }

    groupedOrdersMap.get(szamlaszam).books.push({ cim, darab });
    });

    const groupedOrders = Array.from(groupedOrdersMap.values());



    return(
        <>
        <a href='/' style={{textDecoration:"none", fontSize:"16px"}} className="termek-vissza">← Vissza</a>
        <div className='fodivrendeles'>
        <h2 style={{marginLeft:"5px"}}>Rendeléseim</h2>
        <div>
            {groupedOrders.map(order => (
                <div key={order.szamlaszam} className="order">
                <h4>Rendelés száma: {order.szamlaszam}</h4>
                <strong><p>Fizetési határidő: {new Date(order.fizetesi_hatarido).toLocaleDateString()}</p></strong>
                <strong><p>Fizetési mód: {order.fizetesi_mod}</p></strong>
                <strong><p>Szállítási mód: {order.szallitasi_mod}</p></strong>
                <strong><p>Megrendelt termékek:</p></strong>
                <ul>
                    {order.books.map((book, idx) => (
                    <li key={idx}>{book.cim} - {book.darab} db</li>
                    ))}
                </ul>
                <strong><h4>Végösszeg: {order.vegosszeg} Ft</h4></strong>
                </div>
            ))}
        </div>
      </div>
        </>
    )

}