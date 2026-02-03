import { useState, useEffect } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';

export default function AdminModositasok( {accessToken}){
    const [osszesRendeles, setOsszesRendeles] = useState([])
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modositas, setModositas] = useState(null)
    const [statuszok, setStatuszok] = useState([])
    const [ujstatusz, setUjstatusz] = useState("")
     useEffect(() => {
    if (accessToken) {
        setOsszesRendeles([]);
        setPage(1);
        setHasMore(true);
        fetchData(1); 
    }
}, [accessToken])
    const fetchData = async (pageNum) => {
    if (loading) return;
    try {
      const response = await httpCommon.get(
        `/konyvek/adminmodosit?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }

      setOsszesRendeles(prev => [...prev, ...response.data]);
      setUjstatusz("")
    } catch (err) {
      console.error(err);
    }
    finally {
    setLoading(false);
  }
  };
  
useEffect(() => {
  if (!hasMore || loading || !accessToken) return;

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      setPage(prev => {
        const next = prev + 1;
        fetchData(next);
        return next;
      });
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [hasMore, loading, accessToken]);


const groupedOrdersMap = new Map();
osszesRendeles.forEach(row => {
    const { szamlaszam, szamla_id, cim, darab, szamla_kelte, email, rendeles_jelenlegi_statusza, vegosszeg} = row;

    if (!groupedOrdersMap.has(szamlaszam)) {
        groupedOrdersMap.set(szamlaszam, {
        szamla_id,
        szamlaszam,
        szamla_kelte,
        email,
        rendeles_jelenlegi_statusza,
        vegosszeg,
        books: []
        });
    }
    const order = groupedOrdersMap.get(szamlaszam)
     const alreadyExists = order.books.some(
    b => b.cim === cim
  );

  if (!alreadyExists) {
    order.books.push({ cim, darab });
  }
    });

    const groupedOrders = Array.from(groupedOrdersMap.values());
   
    useEffect(() =>{
        const fetchData = async () =>{
            try{
                const response = await httpCommon.get("/konyvek/statusz")
                setStatuszok(response.data)
            }
            catch(err){
                console.error(err)
            }
        }
        fetchData()
    }, [])
        const statusz_modositas = async (szamlaszam) => {
          try {
           await httpCommon.put(
              "/konyvek/rendeles_statusz_modositas",{
                szamlaszam : szamlaszam,
                r_statusz: ujstatusz
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
              
            );
          setOsszesRendeles(prev =>
            prev.map(r =>
              r.szamlaszam === szamlaszam
                ? {
                    ...r,
                    rendeles_jelenlegi_statusza:
                      statuszok.find(s => s.id === ujstatusz)?.statusz,
                  }
                : r
            )
          );
          } catch (error) {
            console.error("Sikertelen módosítás:", error);
          }
        };
    return(
        <>
        {groupedOrders.map(order => (
                <div key={order.szamlaszam} className="order">
                <h4>Rendelés száma: {order.szamlaszam}</h4>
               { modositas === order.szamlaszam ?
               (
                <>
               <select value={ujstatusz} onChange={(e) => setUjstatusz(Number(e.target.value))}>
                {statuszok.map((s) =>(
                  <option key={s.id} value={s.id}>
                    {s.statusz}
                  </option>
                ))}
               </select>
               <Button style={{marginLeft:"15px"}} className="apply-filters-btn" onClick={(()=>{statusz_modositas(order.szamlaszam); setModositas(null)})}>Mentés</Button>
               <Button className="clear-filters-btn" onClick={(() =>{setModositas(null)})}>Mégse</Button></>) :(
                <span><h4>Rendelés státusza: {order.rendeles_jelenlegi_statusza}</h4> <Button className="apply-filters-btn" onClick={() => {setModositas(order.szamlaszam); const current = statuszok.find(s => s.statusz === order.rendeles_jelenlegi_statusza);setUjstatusz(current?.id ?? "");}}>Módosítás</Button></span>)}
                <strong><p>Számla létrejötte: {new Date(order.szamla_kelte).toLocaleDateString()}</p></strong>
                <strong><p>Rendelő email címe: {order.email}</p></strong>
                <strong><p>Megrendelt termékek:</p></strong>
                <ul>
                    {order.books.map((book, idx) => (
                    <li key={idx}>{book.cim} - {book.darab} db</li>
                    ))}
                </ul>
                <strong><h4>Végösszeg: {order.vegosszeg} FT</h4></strong>
                </div>
            ))}
        </>
    )
}