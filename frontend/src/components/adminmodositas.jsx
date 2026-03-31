import { useState, useEffect, useCallback, useRef } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';
import "./rendelesek.css";

export default function AdminModositasok({ accessToken }) {
    const [osszesRendeles, setOsszesRendeles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const [searchEmail, setSearchEmail] = useState("");
    const [searchSzamlaszam, setSearchSzamlaszam] = useState("");
    
    const [modositas, setModositas] = useState(null);
    const [statuszok, setStatuszok] = useState([]);
    const [ujstatusz, setUjstatusz] = useState("");
    const [teljesites_kelte, setTeljesites_kelte] = useState(null)
    const [fizetesi_mod, setFizetesi_mod] = useState("")
    const observerRef = useRef();


    const fetchOrders = useCallback(async (pageNum, isNewSearch = false) => {
        if (loading) return;
        
        try {
            setLoading(true);

            const response = await httpCommon.get(
                `/admin/searchRendelesek?page=${pageNum}&limit=10&email=${searchEmail}&szamlaszam=${searchSzamlaszam}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const data = response.data;

            if (data.length === 0) {
                if (isNewSearch) setOsszesRendeles([]);
                setHasMore(false);
            } else {
                setOsszesRendeles(prev => isNewSearch ? data : [...prev, ...data]);
                setHasMore(data.length === 10);
            }
        } catch (err) {
            console.error("Hiba a rendelések lekérésekor:", err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, searchEmail, searchSzamlaszam]);


    useEffect(() => {
        if (accessToken) {
            setPage(1);
            setHasMore(true);
            fetchOrders(1, true);
        }
    }, [accessToken, searchEmail, searchSzamlaszam, fetchOrders]);


    const lastOrderRef = useCallback(node => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchOrders(nextPage);
                    return nextPage;
                });
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, fetchOrders]);


    const groupedOrdersMap = new Map();
    osszesRendeles.forEach(row => {
        const { szamlaszam, szamla_id, cim, darab, szamla_kelte, email, rendeles_jelenlegi_statusza, vegosszeg, fizetesi_mod } = row;

        if (!groupedOrdersMap.has(szamlaszam)) {
            groupedOrdersMap.set(szamlaszam, {
                szamla_id,
                szamlaszam,
                szamla_kelte,
                email,
                rendeles_jelenlegi_statusza,
                vegosszeg,
                fizetesi_mod,
                books: []
            });
        }
        const order = groupedOrdersMap.get(szamlaszam);
        if (!order.books.some(b => b.cim === cim)) {
            order.books.push({ cim, darab });
        }
    });
    const groupedOrders = Array.from(groupedOrdersMap.values());

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await httpCommon.get("/konyvek/statusz");
                setStatuszok(res.data);
            } catch (err) { console.error(err); }
        };
        fetchStatus();
    }, []);

    const statusz_modositas = async (szamlaszam) => {
        try {
        const kuldendoDatum = (Number(ujstatusz) === 4 && fizetesi_mod === "Utánvét") 
            ? new Date().toISOString().split('T')[0] 
            : null;
            await httpCommon.put("/admin/rendeles_statusz_modositas", 
                { szamlaszam, r_statusz: ujstatusz, teljesites_kelte: kuldendoDatum },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            
            setOsszesRendeles(prev => prev.map(r => 
                r.szamlaszam === szamlaszam 
                ? { ...r, rendeles_jelenlegi_statusza: statuszok.find(s => s.id === ujstatusz)?.statusz } 
                : r
            ));
            setModositas(null);
        } catch (error) {
            console.error("Sikertelen módosítás:", error);
        }
    };

    return (
        <>
            <div style={{ position: "sticky", top: 70, backgroundColor: "#ceb795", padding: "15px", zIndex: 100, borderBottom: "2px solid #ddd", marginBottom: "20px", display: "flex", gap: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" , borderRadius: "0 0 8px 8px" }}>
                <input 
                    type="text" 
                    placeholder="Keresés email alapján..." 
                    value={searchEmail} 
                    onChange={(e) => setSearchEmail(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#ffffffec", fontSize:"14px" }}
                />
                <input 
                    type="text" 
                    placeholder="Számlaszám..." 
                    value={searchSzamlaszam} 
                    onChange={(e) => setSearchSzamlaszam(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#ffffffec", fontSize:"14px"}}
                />
            </div>

            {groupedOrders.map((order, index) => {
                const isLast = groupedOrders.length === index + 1;
                return (
                    <div key={order.szamlaszam} className="order" ref={isLast ? lastOrderRef : null}>
                        <h4>Rendelés száma: {order.szamlaszam}</h4>
                        
                        {modositas === order.szamlaszam ? (
                            <div style={{ marginBottom: "15px"}}>
                                <select value={ujstatusz} onChange={(e) => setUjstatusz(Number(e.target.value))}>
                                    <option value="">Válassz státuszt...</option>
                                    {statuszok.map((s) => (
                                        <option key={s.id} value={s.id}>{s.statusz}</option>
                                    ))}
                                </select>
                                <div style={{display:"flex", width:"120px"}}>
                                    <Button style={{marginRight:"15px" }} className="apply-filters-btn" onClick={() => statusz_modositas(order.szamlaszam)}>Mentés</Button>
                                    <Button className="clear-filters-btn" onClick={() => setModositas(null)}>Mégse</Button>
                                </div>
                                
                            </div>
                        ) : (
                            <div style={{ marginBottom: "15px" }}>
                                <span><b>Státusz:</b> {order.rendeles_jelenlegi_statusza} </span>
                                <Button className="apply-filters-btn" size="sm" onClick={() => {
                                    setModositas(order.szamlaszam);
                                    const current = statuszok.find(s => s.statusz === order.rendeles_jelenlegi_statusza);
                                    setUjstatusz(current?.id ?? "");
                                    setFizetesi_mod(String(order.fizetesi_mod));
                                }}>Módosítás</Button>
                            </div>
                        )}

                        <p><b>Dátum:</b> {new Date(order.szamla_kelte).toLocaleDateString()}</p>
                        <p><b>Email:</b> {order.email}</p>
                        <p><b>Termékek:</b></p>
                        <ul>
                            {order.books.map((book, idx) => (
                                <li key={idx}>{book.cim} - {book.darab} db</li>
                            ))}
                        </ul>
                        <h4>Végösszeg: {order.vegosszeg} FT</h4>
                    </div>
                );
            })}

            {loading && <p style={{ textAlign: "center" }}><b>Rendelések betöltése...</b></p>}
            {!hasMore && osszesRendeles.length > 0 && <p style={{ textAlign: "center", color: "gray" }}>Nincs több rendelés.</p>}
            {osszesRendeles.length === 0 && !loading && <p style={{ textAlign: "center" }}>Nincs a keresésnek megfelelő találat.</p>}
        </>
    );
}