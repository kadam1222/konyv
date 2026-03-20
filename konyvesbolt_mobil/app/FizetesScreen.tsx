import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { useCart } from './(tabs)/CartContext';
import { api } from '@/api/api';

const FizetesScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  
  // Felhasználói és szállítási állapotok
  const [lakcim, setLakcim] = useState('');
  const [shippingMethod, setShippingMethod] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(1);  
  const [loading, setLoading] = useState(false);
  const [adoszam, setAdoszam] = useState("")


  const szallitasiKoltseg = shippingMethod === 1 ? 500 : 0;
  const vegosszeg = totalPrice + szallitasiKoltseg;

  const handleFinalize = async () => {
    if (!lakcim && shippingMethod === 1) {
      return Alert.alert("Hiba", "Kérjük, add meg a szállítási címet!");
    }

    setLoading(true);
    const kuldendoDatum = paymentMethod == 1 ? null : new Date().toISOString().split('T')[0];

    try {

      const response = await api.post("/konyvek/szamla", {
        fizetesi_mod: paymentMethod,
        szallitas_mod: shippingMethod,
        termekek: cart.map(item => ({
          ISBN: item.ISBN,
          darab: item.mennyiseg,
          ar: item.ar,
          cim: item.cim
        })),
        nev: user?.vevo_nev,
        email: user?.email,
        lakcim: lakcim,
        adoszam: adoszam,
        teljesites_kelte: kuldendoDatum
      });

      Alert.alert("Sikeres rendelés!", "Köszönjük a vásárlást",  [
        { text: "OK", onPress: () => {
          clearCart(); 
          router.replace('/(tabs)'); 
        }}
      ]);

    } catch (err: any) {
      console.error(err);
      console.error("DEBUG:", err.response?.data);
      Alert.alert("Hiba", err.response?.data?.message || "Hiba a rendelés leadásakor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Fizetés és Szállítás</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Név:</Text>
        <TextInput style={[styles.input, styles.disabled]} value={user?.vevo_nev} editable={false} />
        <Text style={styles.label}>Email:</Text>
        <TextInput style={[styles.input, styles.disabled]} value={user?.email} editable={false} />
      </View>

      <Text style={styles.subHeader}>Szállítási adatok</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Szállítási lakcím (Város, utca...)" 
        value={lakcim} 
        onChangeText={setLakcim} 
      />
      <Text style={styles.subHeader}>Adószám (csak cégek esetében)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Adószám" 
        value={adoszam} 
        onChangeText={setAdoszam} 
      />

      <Text style={styles.subHeader}>Szállítási mód</Text>
      <View style={styles.optionsRow}>
        <RadioButton label="Házhoz (+500 Ft)" selected={shippingMethod === 1} onPress={() => setShippingMethod(1)} />
        <RadioButton label="Személyes (0 Ft)" selected={shippingMethod === 2} onPress={() => setShippingMethod(2)} />
      </View>

      <Text style={styles.subHeader}>Fizetési mód</Text>
      <View style={styles.optionsRow}>
        <RadioButton label="Utánvét" selected={paymentMethod === 1} onPress={() => setPaymentMethod(1)} />
        <RadioButton label="Utalás" selected={paymentMethod === 2} onPress={() => setPaymentMethod(2)} />
        <RadioButton label="Kártya" selected={paymentMethod === 3} onPress={() => setPaymentMethod(3)} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalText}>Fizetendő: {vegosszeg} Ft</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#28a745" />
        ) : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleFinalize}>
            <Text style={styles.submitText}>Rendelés leadása</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};


const RadioButton = ({ label, selected, onPress }: any) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default FizetesScreen
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2, marginBottom: 15 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff', fontSize: 16 },
  disabled: { backgroundColor: '#eee', color: '#888' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radioOuter: { height: 22, width: 22, borderRadius: 11, borderWidth: 2, borderColor: '#007bff', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  radioOuterSelected: { borderColor: '#28a745' },
  radioInner: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#28a745' },
  radioLabel: { fontSize: 15 },
  footer: { marginTop: 30, paddingBottom: 60, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 20 },
  totalText: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 20 },
  submitBtn: { backgroundColor: '#28a745', padding: 16, borderRadius: 10, alignItems: 'center' },
  submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});