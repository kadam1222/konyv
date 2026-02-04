import { useState, useEffect, useCallback, useRef } from "react";
import httpCommon from "../http-common";
import Button from 'react-bootstrap/Button';
import "./rendelesek.css";

export default function AdminModositasok({ accessToken }) {
    const [osszesRendeles, setOsszesRendeles] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // Keresési feltételek
    const [searchEmail, setSearchEmail] = useState("");
    const [searchSzamlaszam, setSearchSzamlaszam] = useState("");
    
    const [modositas, setModositas] = useState(null);
    const [statuszok, setStatuszok] = useState([]);
    const [ujstatusz, setUjstatusz] = useState("");

    const observerRef = useRef();

    // --- 1. ADATOK LEKÉRÉSE A SZERVERRŐL ---
    const fetchOrders = useCallback(async (pageNum, isNewSearch = false) => {
        if (loading) return;
        
        try {
            setLoading(true);
            // Az új /searchRendelesek végpontot használjuk
            const response = await httpCommon.get(
                `/konyvek/searchRendelesek?page=${pageNum}&limit=10&email=${searchEmail}&szamlaszam=${searchSzamlaszam}`,
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

    // --- 2. KERESÉS ÉS KEZDETI BETÖLTÉS ---
    useEffect(() => {
        if (accessToken) {
            setPage(1);
            setHasMore(true);
            fetchOrders(1, true);
        }
    }, [accessToken, searchEmail, searchSzamlaszam, fetchOrders]);

    // --- 3. INTERSECTION OBSERVER ---
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

    // --- 4. CSOPORTOSÍTÁS (Változatlan logika) ---
    const groupedOrdersMap = new Map();
    osszesRendeles.forEach(row => {
        const { szamlaszam, szamla_id, cim, darab, szamla_kelte, email, rendeles_jelenlegi_statusza, vegosszeg } = row;

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
        const order = groupedOrdersMap.get(szamlaszam);
        if (!order.books.some(b => b.cim === cim)) {
            order.books.push({ cim, darab });
        }
    });
    const groupedOrders = Array.from(groupedOrdersMap.values());

    // --- 5. STÁTUSZOK ÉS MÓDOSÍTÁS ---
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
            await httpCommon.put("/konyvek/rendeles_statusz_modositas", 
                { szamlaszam, r_statusz: ujstatusz },
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
            <div style={{ position: "sticky", top: 70, backgroundColor: "#fff", padding: "15px", zIndex: 100, borderBottom: "2px solid #ddd", marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Keresés email alapján..." 
                    value={searchEmail} 
                    onChange={(e) => setSearchEmail(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                <input 
                    type="text" 
                    placeholder="Számlaszám..." 
                    value={searchSzamlaszam} 
                    onChange={(e) => setSearchSzamlaszam(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
            </div>

            {groupedOrders.map((order, index) => {
                const isLast = groupedOrders.length === index + 1;
                return (
                    <div key={order.szamlaszam} className="order" ref={isLast ? lastOrderRef : null}>
                        <h4>Rendelés száma: {order.szamlaszam}</h4>
                        
                        {modositas === order.szamlaszam ? (
                            <div style={{ marginBottom: "15px" }}>
                                <select value={ujstatusz} onChange={(e) => setUjstatusz(Number(e.target.value))}>
                                    <option value="">Válassz státuszt...</option>
                                    {statuszok.map((s) => (
                                        <option key={s.id} value={s.id}>{s.statusz}</option>
                                    ))}
                                </select>
                                <Button style={{ marginLeft: "15px" }} className="apply-filters-btn" onClick={() => statusz_modositas(order.szamlaszam)}>Mentés</Button>
                                <Button className="clear-filters-btn" onClick={() => setModositas(null)}>Mégse</Button>
                            </div>
                        ) : (
                            <div style={{ marginBottom: "15px" }}>
                                <span><b>Státusz:</b> {order.rendeles_jelenlegi_statusza} </span>
                                <Button className="apply-filters-btn" size="sm" onClick={() => {
                                    setModositas(order.szamlaszam);
                                    const current = statuszok.find(s => s.statusz === order.rendeles_jelenlegi_statusza);
                                    setUjstatusz(current?.id ?? "");
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