import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useCart } from './CartContext';
import { api } from '@/api/api'; 
import { useRouter } from 'expo-router';

const KosarScreen = () => {
  const { cart, totalPrice, removeFromCart, clearCart } = useCart();
const router = useRouter()
  const handleRendeles = async () => {
    if (cart.length === 0) return Alert.alert("Hiba", "Üres a kosarad!");

    try {
      // Itt küldjük el a backendnek a rendelést
      // A backendnek szüksége lesz a tételekre és a felhasználóra (akit az accessToken alapján azonosít)
      await api.post('/konyvek/rendeles', { items: cart, osszeg: totalPrice });
      
      Alert.alert("Siker", "Rendelésedet rögzítettük!");
      clearCart();
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült a rendelés leadása.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kosár tartalma</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.ISBN}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View>
              <Text style={styles.itemTitle}>{item.cim}</Text>
              <Text>{item.mennyiseg} db x {item.ar} Ft</Text>
            </View>
            <Button title="X" color="red" onPress={() => removeFromCart(item.ISBN)} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Még nincs semmi a kosárban.</Text>}
      />
      
        <Button 
        title="Tovább a pénztárhoz" 
        onPress={() => router.push('/FizetesScreen')} 
        disabled={cart.length === 0} 
        />
    </View>
  );
};

export default KosarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  cartItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    marginBottom: 10,
    elevation: 2 
  },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  footer: { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray' }
});