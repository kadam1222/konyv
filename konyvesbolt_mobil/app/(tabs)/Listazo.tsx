import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, Button, ActivityIndicator, FlatList, StyleSheet,
  Alert, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions
} from 'react-native';
import axios from 'axios';
import { useCart } from './CartContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; 


type Termek = {
  id: number;
  ISBN: string;
  cim: string;
  ar: number;
};

type Kategoria = {
  id: number;
  kat_nev: string;
  katazon: number | null;
};

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
const PAGE_SIZE = 10;

const ListazoInfinite = () => {
  const { addToCart } = useCart();
  const [data, setData] = useState<Termek[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [kategoriak, setKategoriak] = useState<Kategoria[]>([]);

  useEffect(() => {
    fetchCategories();
    loadPage(1, true);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/konyvek/kategoria`);
      console.log("Kategóriák a backendről:", response.data[0]); // Nézd meg az első elemet!
      setKategoriak(response.data);
    } catch (err) {
      console.error("Hiba a kategóriák betöltésekor:", err);
    }
  };

  const loadPage = async (pageNum: number, refresh = false, query = activeSearch, kat = selectedCategory) => {
    if (loading && !refresh) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = (query || (kat && kat !== "Összes")) ? '/konyvek/search' : '/konyvek';
      
      const response = await axios.get<Termek[]>(`${backendUrl}${endpoint}`, {
        params: {
          page: pageNum,
          cim: query,
          kat: kat === "Összes" ? null : kat,
        },
        timeout: 5000,
      });

      const newData = response.data;
      setData(prev => (refresh ? newData : [...prev, ...newData]));
      setHasMore(newData.length === PAGE_SIZE);
      setPage(pageNum);
    } catch (err) {
      setError('❌ Nem érhető el a backend szerver');
    } finally {
      setLoading(false);
    }
  };

  const startSearch = () => {
    setData([]);
    setActiveSearch(searchQuery);
    setPage(1);
    setHasMore(true);
    loadPage(1, true, searchQuery, selectedCategory);
  };

  const handleSelectCategory = (kat_nev: string | null) => {
    setSelectedCategory(kat_nev);
    setIsFilterVisible(false);
    setData([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true, activeSearch, kat_nev);
  };

  const renderKategoriaLista = () => {
    const fokategoriak = kategoriak.filter(k => k.katazon === null);

    return (
      <ScrollView style={{ maxHeight: 400 }}>
        <TouchableOpacity 
          style={[styles.categoryItem, selectedCategory === null && styles.selectedCategoryItem]} 
          onPress={() => handleSelectCategory("Összes")}
        >
          <Text style={[styles.categoryText, { fontWeight: 'bold' }]}>Összes termék</Text>
        </TouchableOpacity>

        {fokategoriak.map((foker) => (
          <View key={foker.id}>
            <View style={styles.fokategHeader}>
              <Text style={styles.fokategText}>{foker.kat_nev}</Text>
            </View>
            
            {kategoriak
              .filter(alkat => alkat.katazon === foker.id)
              .map(alkat => (
                <TouchableOpacity 
                  key={alkat.id} 
                  style={[
                    styles.categoryItem, 
                    { paddingLeft: 30 },
                    selectedCategory === alkat.kat_nev && styles.selectedCategoryItem
                  ]}
                  onPress={() => handleSelectCategory(alkat.kat_nev)}
                >
                  <Text style={styles.categoryText}>• {alkat.kat_nev}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.htext}>Terméklista</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Keresés..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.searchButton} onPress={startSearch}>
          <Text style={styles.searchButtonText}>Keresés</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: selectedCategory && selectedCategory !== "Összes" ? '#28a745' : '#444' }]} 
          onPress={() => setIsFilterVisible(true)}
        >
          <Text style={{ color: 'white' }}>Szűrő</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => {
    if (item && item.id) {
      return item.id.toString();
    }
    return index.toString();
  }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title} numberOfLines={1}>{item.cim}</Text>
            <Image
              source={{ uri: `${backendUrl}/kepek/${item.ISBN}.jpg` }}
              style={styles.image}
            />
            <Text style={styles.price}>{item.ar} Ft</Text>
            <Button
              title="Kosárba"
              onPress={() => {
                addToCart(item);
                Alert.alert("Siker", "Kosárba került!");
              }}
            />
          </View>
        )}
        onEndReached={() => hasMore && loadPage(page + 1)}
        onEndReachedThreshold={0.5}
        refreshing={loading && page === 1}
        onRefresh={() => loadPage(1, true)}
        ListFooterComponent={loading ? <ActivityIndicator color="yellow" /> : null}
      />

      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Válassz kategóriát</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Bezárás</Text>
              </TouchableOpacity>
            </View>
            {renderKategoriaLista()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListazoInfinite;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e' },
  searchContainer: { flexDirection: 'row', padding: 10, gap: 10 },
  searchInput: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 8 },
  searchButton: { backgroundColor: 'yellow', padding: 10, borderRadius: 8, justifyContent: 'center' },
  searchButtonText: { fontWeight: 'bold' },
  htext: { fontSize: 24, color: 'yellow', textAlign: 'center', marginVertical: 10 },
  item: { flex: 1, margin: 8, padding: 10, backgroundColor: 'white', borderRadius: 8, width: CARD_WIDTH, alignItems: 'center' },
  image: { height: 120, width: '100%', resizeMode: 'contain' },
  title: { fontWeight: 'bold', marginBottom: 5 },
  price: { marginVertical: 5, color: '#444' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold' },
  fokategHeader: { backgroundColor: '#f0f0f0', padding: 8, marginTop: 10, borderRadius: 4 },
  fokategText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  categoryItem: { paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  categoryText: { fontSize: 16 },
  selectedCategoryItem: { backgroundColor: '#fff9c4' },
});