import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

interface FavoriteCompany {
  domain: string;
  userId: string;
}

const CompanyManageScreen = () => {
  const [favorites, setFavorites] = useState<FavoriteCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL =
    'https://ok2h7gxa5l.execute-api.us-east-1.amazonaws.com/prod/favoritescompanies';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFavorites(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        Alert.alert('Error', 'Failed to load favorite companies');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading favorite companies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorite Companies</Text>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>You don't have any favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `${item.domain}-${item.userId}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.domain}>{item.domain}</Text>
              <Text style={styles.userId}>User ID: {item.userId}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

export default CompanyManageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
  },
  domain: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
