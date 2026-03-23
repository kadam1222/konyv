import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  Button 
} from 'react-native';
import { api } from '@/api/api';

// Interfész a "lapos" adatokhoz, amik a szerverről jönnek
interface RawOrderRow {
  szamla_id: number;
  szamlaszam: string;
  szamla_kelte: string;
  fizetesi_hatarido: string;
  vegosszeg: number;
  rendeles_jelenlegi_statusza: string;
  fizetesi_mod: string;
  szallitasi_mod: string;
  email: string;
  lakcim: string;
  adoszam?: string;
  cim: string; // A könyv címe
  darab: number; // A könyv darabszáma
}

const RendelesekScreen = () => {
  const [rawRows, setRawRows] = useState<RawOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string | null>(null);

  useEffect(() => {
    fetchRendelesek();
  }, []);

  const fetchRendelesek = async () => {
    try {
      const response = await api.get('/konyvek/rendelesek');
      setRawRows(response.data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült betölteni a rendeléseket.");
    } finally {
      setLoading(false);
    }
  };

  // --- CSOPORTOSÍTÁSI LOGIKA (Ugyanaz, mint a webes Map-ed) ---
  const groupedOrdersMap = new Map();

  rawRows.forEach(row => {
    if (!groupedOrdersMap.has(row.szamlaszam)) {
      groupedOrdersMap.set(row.szamlaszam, {
        ...row,
        books: [] // Itt gyűjtjük a címeket
      });
    }
    groupedOrdersMap.get(row.szamlaszam).books.push({ 
      cim: row.cim, 
      darab: row.darab 
    });
  });

  const groupedOrders = Array.from(groupedOrdersMap.values());

  // Kiválasztott rendelés adatai
  const selectedOrder = groupedOrders.find(o => o.szamlaszam === selectedOrderNo);

  // --- SZÁMLA NÉZET ---
  if (selectedOrder) {
    return (
      <ScrollView style={styles.invoiceContainer}>
        <View style={styles.backButton}>
          <Button title="← Vissza a listához" onPress={() => setSelectedOrderNo(null)} color="#007bff" />
        </View>

        <View style={styles.invoiceBox}>
          <View style={styles.header}>
            <Text style={styles.invoiceTitle}>SZÁMLA</Text>
            <Text style={styles.invoiceNumber}>{selectedOrder.szamlaszam}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Vevő:</Text>
            <Text style={styles.value}>{selectedOrder.email}</Text>
            <Text style={styles.value}>{selectedOrder.lakcim}</Text>
          </View>

          <View style={styles.divider} />

          {/* TERMÉKEK LISTÁJA A CSOPORTOSÍTOTT "BOOKS" TÖMBBŐL */}
          <Text style={[styles.label, { marginBottom: 10 }]}>Megrendelt termékek:</Text>
          {selectedOrder.books.map((book: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemCim}>{book.cim}</Text>
              <Text style={styles.itemMennyiseg}>{book.darab} db</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Fizetés:</Text>
            <Text style={styles.value}>{selectedOrder.fizetesi_mod}</Text>
          </View>
          
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Végösszeg:</Text>
            <Text style={styles.totalValue}>{selectedOrder.vegosszeg.toLocaleString()} Ft</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // --- LISTA NÉZET ---
  if (loading) return <ActivityIndicator size="large" style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rendeléseim</Text>
      <FlatList
        data={groupedOrders}
        keyExtractor={(item) => item.szamlaszam}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedOrderNo(item.szamlaszam)}>
            <View style={styles.cardHeader}>
              <Text style={styles.szamlaszamText}>{item.szamlaszam}</Text>
              <Text style={styles.statuszText}>{item.rendeles_jelenlegi_statusza}</Text>
            </View>
            <Text style={styles.infoText}>Dátum: {new Date(item.szamla_kelte).toLocaleDateString()}</Text>
            <Text style={styles.infoText}>Termékek száma: {item.books.length} féle</Text>
            <Text style={styles.detailsHint}>Részletek megnyitása →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RendelesekScreen;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

  // Kártyák a listában
  card: {
    backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 8 },
  szamlaszamText: { fontWeight: 'bold', fontSize: 16 },
  statuszText: { fontWeight: '600' },
  infoText: { color: '#666', marginBottom: 2 },
  detailsHint: { fontSize: 12, color: '#007bff', marginTop: 10, textAlign: 'right' },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },

  // Számla stílusok
  invoiceContainer: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 10, alignItems: 'flex-start' },
  invoiceBox: { padding: 20, margin: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  header: { alignItems: 'center', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#000', paddingBottom: 10 },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  invoiceNumber: { fontSize: 16, color: '#555' },
  section: { marginBottom: 15 },
  label: { fontSize: 12, color: '#888', textTransform: 'uppercase', fontWeight: 'bold' },
  value: { fontSize: 15, color: '#333', marginBottom: 2 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5 },
  
  // Termékek táblázat-szerű megjelenítése
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemCim: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemArInfo: { fontSize: 12, color: '#777' },
  itemMennyiseg: { flex: 0.5, textAlign: 'center', fontSize: 14, color: '#333' },
  itemOsszeg: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 'bold', color: '#333' },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  totalSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
});