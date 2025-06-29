import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount?: number;
}

export default function SearchBar({ searchTerm, setSearchTerm, resultsCount }: SearchBarProps) {
  const { theme } = useTheme();

  return (
    <>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
        <TextInput
          mode='outlined'
          placeholder='Search items...'
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
          theme={{
            ...theme,
            roundness: 40,
          }}
          left={<TextInput.Icon icon='magnify' />}
          right={
            searchTerm ? (
              <TextInput.Icon icon='close' onPress={() => setSearchTerm("")} forceTextInputFocus={false} />
            ) : null
          }
        />
      </View>

      {/* Search results count */}
      {searchTerm && resultsCount !== undefined && (
        <View style={styles.resultsCount}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            {resultsCount} {resultsCount === 1 ? "result" : "results"} found
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  searchInput: {
    backgroundColor: "transparent",
  },
  resultsCount: {
    padding: 10,
    alignItems: "center",
  },
});
