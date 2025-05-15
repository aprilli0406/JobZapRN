import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
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

  const handleRemove = async (domain: string, userId: string) => {
    try {
      const res = await fetch(
        `${API_URL}?domain=${domain}&userId=${userId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      // Remove item from state
      setFavorites((prev) =>
        prev.filter((item) => !(item.domain === domain && item.userId === userId))
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert('@ Error', 'Could not delete favorite');
    }
  };

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
  <ScrollView contentContainerStyle={styles.outer}>
    <View style={styles.card}>
      <Text style={styles.title}>My Favorite Companies</Text>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>You don't have any favorites yet.</Text>
      ) : (
        favorites.map((item) => (
          <View key={`${item.domain}-${item.userId}`} style={styles.inputGroup}>
            <Text style={styles.label}>{item.domain}</Text>
            <Pressable onPress={() => handleRemove(item.domain, item.userId)}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  </ScrollView>
);

};

export default CompanyManageScreen;

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    backgroundColor: "#007aff",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
  },
  label: {
    fontWeight: "500",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  remove: {
    fontSize: 14,
    color: "#dc3545",
    fontWeight: "bold",
  },
  empty: {
    marginTop: 32,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  center: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
error: {
  color: 'red',
  fontSize: 16,
},
});

