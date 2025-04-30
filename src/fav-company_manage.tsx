import React, { useEffect, useState } from 'react';
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
    <View style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.title}>My Favorite Companies</Text>
  
        {favorites.length === 0 ? (
          <Text style={styles.empty}>You don't have any favorites yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => `${item.domain}-${item.userId}`}
            renderItem={({ item }) => (
              <View style={styles.listItemColumn}>
                <Text style={styles.domain}>{item.domain}</Text>
                <Pressable onPress={() => handleRemove(item.domain, item.userId)}>
                <Text style={styles.remove}>❌ Remove</Text>
                </Pressable>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={{ width: "100%" }}
          />
        )}
      </View>
    </View>
  );
  
};

export default CompanyManageScreen;

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },  
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },  
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },  
  domain: {
    fontSize: 18,
    fontWeight: '500',
  },
  remove: {
    color: 'red',
    marginTop: 10,
    fontWeight: '300',
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
  listItemColumn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: "flex-start",
  },  
});
