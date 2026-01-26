import { useState, useEffect } from "react";
import httpCommon from "../http-common";

export default function AdminModositasok( {accessToken}){
    const [osszesRendeles, setOsszesRendeles] = useState([])
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modositas, setModositas] = useState(false)
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
    const { szamlaszam, szamla_id, cim, darab, keletkezes, email, rendeles_jelenlegi_statusza} = row;

    if (!groupedOrdersMap.has(szamlaszam)) {
        groupedOrdersMap.set(szamlaszam, {
        szamla_id,
        szamlaszam,
        keletkezes,
        email,
        rendeles_jelenlegi_statusza,
        books: []
        });
    }

    groupedOrdersMap.get(szamlaszam).books.push({ cim, darab });
    });

    const groupedOrders = Array.from(groupedOrdersMap.values());

    return(
        <>
        {groupedOrders.map(order => (
                <div key={order.szamlaszam} className="order">
                <h4>Rendelés száma: {order.szamlaszam}</h4>
                <span><h4>Rendelés státusza: {order.rendeles_jelenlegi_statusza}</h4> <button onClick={() => !modositas}>Módosítás</button></span>
                <strong><p>Számla létrejötte: {new Date(order.keletkezes).toLocaleDateString()}</p></strong>
                <strong><p>Rendelő email címe: {order.email}</p></strong>
                <strong><p>Megrendelt termékek:</p></strong>
                <ul>
                    {order.books.map((book, idx) => (
                    <li key={idx}>{book.cim} - {book.darab} db</li>
                    ))}
                </ul>
                </div>
            ))}
        </>
    )
}