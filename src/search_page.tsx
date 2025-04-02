import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";

interface Company {
  id: string;
  name: string;
}

const SearchScreen = () => {
    
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Company[]>([]);

  const data: Company[] = [
    { id: "1", name: "Google" },
    { id: "2", name: "Microsoft" },
    { id: "3", name: "Amazon" },
    { id: "4", name: "Alibaba" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results: Company[] = query
      ? data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      : data;

    setFilteredResults(results);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a tech company..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredResults.length > 0 ? filteredResults : data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text style={styles.resultItem}>{item.name}</Text>}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default SearchScreen; // ✅ Ensure default export
