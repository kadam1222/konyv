
import React, { useEffect, useState } from 'react';
import {View, Text, Image, Button, ActivityIndicator, FlatList, StyleSheet, Alert, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { useCart } from './CartContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const NUM_COLUMNS = 2;
const CARD_WIDTH =
  (width - CARD_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS;


type Termek = {
  id: number;
  termek: string;
  ar: number;
  kepnev: string;
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
  const [searchQuery , setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadPage(1);
  }, []);

  const startSearch = () =>{
    const cleanQuery = searchQuery.trim();
    setData([])
    setActiveSearch(searchQuery)
    setPage(1)
    setHasMore(true)
    loadPage(1, true, cleanQuery)
  }
  const loadPage = async (pageNum: number, refresh = false, query = activeSearch) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = query ? '/konyvek/search' : '/konyvek';
      const response = await axios.get<Termek[]>(
        `${backendUrl}${endpoint}`,
        {
          params: {
            page: pageNum,
            cim: query
            //limit: PAGE_SIZE,
          },
          timeout: 5000,
        }
      );

      const newData = response.data;
      setData((prev) =>{
        if (refresh || pageNum === 1) return newData;
        return [...prev, ...newData]
      })
      if (newData.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('❌ Nem érhető el a backend szerver');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadPage(page + 1);
    }
  };

  const refreshList = () => {
    setHasMore(true);
    loadPage(1, true);
  };

  if (error && data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Újrapróbálás" onPress={refreshList} />
      </View>
    );
  }

 return (
  <View style={styles.container}>
    <Text style={styles.htext}>Terméklista</Text>

    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Keresés..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)} 
        clearButtonMode="while-editing"
      />
      <Button
        title='Keresés' onPress={startSearch}
      />
    </View>

    <FlatList
      data={data}
      numColumns={2}
      key={2} 
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => router.push({pathname: "/BookDetails", params: { isbn: item.ISBN }})}>
          <View style={styles.cardTopContent}>
            <Text style={styles.title} numberOfLines={2}> {item.cim} </Text>

          <Image
            source={{ uri: `${backendUrl}/kepek/${item.ISBN}.jpg` }}
            style={styles.image}
          />

          <Text numberOfLines={2} style={styles.price}>Ár: {item.ar} Ft</Text>

          <View style={styles.buttonContainer}>
          <Button
            title="Kosárba"
            onPress={() => {
              addToCart(item);
              Alert.alert("Sikeres kosárba rakás", "A terméket sikeresen elhelyezte a kosárba");
            }}
          />
          </View>
          </View>
        </TouchableOpacity>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={loading && page === 1}
      onRefresh={refreshList}
      ListFooterComponent={
        loading && page > 1 ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : !hasMore ? (
          <Text style={styles.endText}>Nincs több termék</Text>
        ) : null
      }
    />
  </View>
);
};

export default ListazoInfinite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  htext: {
    fontSize: 24,
    marginVertical: 10,
    textAlign: 'center',
  },
  item: {
    flex : 1,
    margin: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 320,
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTopContent: {
    alignItems: 'center', 
    width: '100%',
  },
  title: {
    fontSize: 16,
    color: 'black',
    textAlign: "center",
    fontWeight: 'bold',
    marginBottom: 5,
    height: 40,
  },
  price: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  image: {
    height: 120,
    resizeMode: 'contain',
    marginVertical: 10,
    width: '100%'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  endText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10,
    gap: 10, 
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',  
  },
  searchInput: {
    flex: 1, 
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
