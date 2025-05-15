import React, { useState, useEffect } from 'react';
import { TextInput, View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../App";
import LinearGradient from 'react-native-linear-gradient';

type CompanyResult = {
  domain: string;
  name: string;
  logo: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchScreen'>;

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanyResult[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`https://lhtlrjyqdg.execute-api.us-east-1.amazonaws.com/dev/companies?search=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.title}>Search Companies</Text>

        <TextInput
          style={styles.input}
          placeholder="Search companies..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          selectionColor="#000"
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.domain}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('CompanyInfo', {
              name: item.name,
              logo: item.logo,
              domain: item.domain,
            })}>
              <View style={styles.resultItem}>
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <Text style={styles.resultText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
         // ListEmptyComponent={<Text style={styles.emptyText}>No results yet.</Text>}
          style={{ marginTop: 20, width: "100%" }}
        />
      </View>

     <TouchableOpacity
  onPress={() => navigation.navigate('UserManage')}
  activeOpacity={0.8}
  style={styles.manageBtnSolid}
>
  <Text style={styles.loginBtnText}>Manage My Account</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#0e89ec",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
    color: "#000",
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#555",
    marginTop: 10,
  },
manageBtn: {
  width: 240, // ✅ custom width (adjust as needed)
  paddingVertical: 14,
  borderRadius: 4, // ✅ same square shape
  alignItems: "center",
},
  manageBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
     borderRadius: 6, 
    },
  loginBtn: {
  padding: 12,
  borderRadius: 6,
  alignItems: "center",
  marginTop: 10,
  width: "100%", // already added earlier
},
loginBtnText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
manageBtnSolid: {
  backgroundColor: '#0059a9', // solid dark blue
  paddingVertical: 14,
  borderRadius: 4,
  alignItems: 'center',
  width: '70%',
  marginTop: 40,
},

});

export default SearchScreen;

