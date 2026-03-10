import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from './(tabs)/CartContext';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

const BookDetails = ({ route }: any) => {
  const { isbn } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Mivel a backend 'req.body.ISBN'-t vár, POST kérést küldünk
        const response = await axios.post(`${backendUrl}/konyvek/isbn`, {
          ISBN: isbn
        });
        setBook(response.data);
      } catch (err) {
        console.error("Hiba a részletek lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  if (loading) return <ActivityIndicator size="large" color="yellow" style={styles.center} />;
  
  if (!book) return <View style={styles.center}><Text style={{color: 'white'}}>Nem található a könyv.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: `${backendUrl}/kepek/${book.ISBN}.jpg` }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{book.cim}</Text>
        <Text style={styles.price}>{book.ar} Ft</Text>
        <Text style={styles.author}>Író: {book.szerzok}</Text>
        <Text style={styles.author}>Kiadó: {book.kiado_nev}</Text>
        <Text style={styles.author}>Nyelv: {book.nyelv_nev}</Text>
        <Text style={styles.author}>Kiadás éve: {book.kiadas_eve}</Text>
        <Text style={styles.author}>ISBN: {book.ISBN}</Text>
        {book.illusztratorok ? <Text style={styles.author}>Illusztrátor(ok): {book.illusztratorok}</Text> : ""}
        {book.fordítok ? <Text style={styles.author}>Fordító(k): {book.forditok}</Text> : ""}
        <Text style={styles.description}>
            {book.leiras}
        </Text>


        <View style={styles.cartSection}>
          {book.raktar === 0 ? (
            <View>
              <Text style={styles.errorText}>
                A termék nincs raktáron.{"\n"}Kérjük próbálkozzon újra később.
              </Text>
              <TouchableOpacity style={[styles.button, styles.disabledButton]} disabled>
                <Text style={styles.buttonText}>Kosárba</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {book.raktar < 5 && (
                <Text style={styles.warningText}>
                  Utolsó darabok! ({book.raktar} db)
                </Text>
              )}
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                  // 3. Itt hívjuk meg a kontextus addToCart függvényét
                  addToCart(book);
                  Alert.alert("Sikeres", `${book.cim} bekerült a kosárba!`);
                }}
              >
                <Text style={styles.buttonText}>Kosárba</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#25292e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25292e' },
  image: { width: '100%', height: 400, resizeMode: 'contain', marginTop: 20 },
  infoContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'yellow', marginBottom: 10 },
  author: { fontSize: 18, color: '#ccc', marginBottom: 10 },
  price: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  description: { fontSize: 16, color: 'white', lineHeight: 24 },
  termekFooter: { marginTop: 20 },
  termekAr: { color: 'yellow', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  nincsRaktaron: { color: "red", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  utolsoDarabok: { color: "red", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  cartSection: { marginVertical: 10 },
  button: {
    backgroundColor: 'yellow',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: "#ff4444", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  warningText: { color: "#ffbb33", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  disabledButton: { backgroundColor: '#555' },
  buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'white', textAlign: 'center', marginTop: 50 }
});

export default BookDetails;