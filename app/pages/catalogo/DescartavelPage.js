import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { BannerEspecial } from '../../assets'; 

const { width } = Dimensions.get('window');

const DescartavelPage = () => {
  // Carregamento das fontes
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BannerEspecial
          style={[styles.bannerContainer]}
          maxWidth={'100%'}
        />
        <View style={styles.content}>
          {/* Descrição */}
          <Text style={styles.description}>
            São resíduos que não podem ser descartados nem no lixo comum, nem no reciclável.
          </Text>

          {/* Lista de Resíduos */}
          <View style={styles.list}>
            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Pilhas</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Eletroeletrônicos</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Lâmpadas</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Óleo De Cozinha</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Pneu</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>Rádio</Text>
            </View>
            <View style={styles.separator} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 85,
  },

  content: {
    paddingHorizontal: 10,
  },

  bannerContainer: {
    marginVertical: -40
  },

  description: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    textAlign: 'center',
    color: '#3F463E',
    paddingHorizontal: 15,
    marginBottom: 25
  },

  list: {
    paddingHorizontal: 20,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  bullet: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    marginRight: 10,
  },

  itemText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    color: '#333',
    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
});

export default DescartavelPage;