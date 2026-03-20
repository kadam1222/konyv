
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';
import { useRouter } from 'expo-router';

const KosarScreen = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kosár tartalma</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.ISBN}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.infoContainer}>
              <Text style={styles.itemTitle}>{item.cim}</Text>
              <Text>{item.ar} Ft / db</Text>
            </View>

            <View style={styles.quantityContainer}>
              {/* Csökkentés gomb */}
              <TouchableOpacity 
                style={styles.qtyButton} 
                onPress={() => updateQuantity(item.ISBN, -1)}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.mennyiseg}</Text>

              {/* Növelés gomb */}
              <TouchableOpacity 
                style={styles.qtyButton} 
                onPress={() => updateQuantity(item.ISBN, 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  cartItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: 15, 
    backgroundColor: 'white', 
    borderRadius: 8, 
    marginBottom: 10,
    elevation: 2 
  },
  infoContainer: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 15 
  },
  qtyButton: { 
    backgroundColor: '#007bff', 
    padding: 8, 
    borderRadius: 5,
    width: 35,
    alignItems: 'center'
  },
  qtyButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  quantityText: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray' }
});

export default KosarScreen;