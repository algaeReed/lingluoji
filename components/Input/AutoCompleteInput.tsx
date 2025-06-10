import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import sampleSuggestions from "./suggestion";

interface Props {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

export default function AutoCompleteInput({ label = "物品名称", value, onChangeText, style }: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const theme = useTheme();

  function fuzzyMatch(input: string, target: string) {
    input = input.toLowerCase();
    target = target.toLowerCase();
    let i = 0;
    for (let char of target) {
      if (char === input[i]) i++;
      if (i === input.length) return true;
    }
    return false;
  }

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) return [];
    const input = value.trim();
    return sampleSuggestions.filter((item) => fuzzyMatch(input, item.name));
  }, [value]);

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text);
      setShowSuggestions(text.trim().length > 0);
    },
    [onChangeText]
  );

  const handleSelect = useCallback(
    (text: string) => {
      onChangeText(text);
      setShowSuggestions(false);
      Keyboard.dismiss();
    },
    [onChangeText]
  );

  const handleDismissKeyboard = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const highlightMatch = (text: string) => {
    const index = text.toLowerCase().indexOf(value.toLowerCase());
    if (index === -1) return <Text>{text}</Text>;

    const before = text.slice(0, index);
    const match = text.slice(index, index + value.length);
    const after = text.slice(index + value.length);

    return (
      <Text>
        {before}
        <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>{match}</Text>
        {after}
      </Text>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
        <TextInput
          label={label}
          mode='outlined'
          value={value}
          onChangeText={handleChangeText}
          onBlur={() => setShowSuggestions(false)}
          style={[styles.input, style]}
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <FlashList
            data={filteredSuggestions}
            estimatedItemSize={40}
            keyExtractor={(item) => item.id}
            style={[styles.suggestionList, { backgroundColor: theme.colors.elevation.level1 }]}
            keyboardShouldPersistTaps='handled'
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item.name)} style={styles.suggestionItem}>
                {highlightMatch(item.name)}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    zIndex: 1,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 160,
    borderRadius: 4,
    elevation: 3,
    zIndex: 2,
    marginTop: 4,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
