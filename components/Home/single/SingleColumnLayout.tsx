// SwipeDeleteExample.tsx

import React, { useEffect, useState } from "react";
import { FlatList, Animated as RNAnimated, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SwipeableRow } from "./SwipeableRow";

export default function SwipeDeleteExample() {
  const [data, setData] = useState([
    { id: "1", text: "第一条手记" },
    { id: "2", text: "第二条手记" },
    { id: "3", text: "第三条手记" },
  ]);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  // Toast自动隐藏
  useEffect(() => {
    if (toastText !== null) {
      const timer = setTimeout(() => setToastText(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [toastText]);

  const onDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const onEdit = (id: string) => {
    alert(`点击了编辑按钮，ID: ${id}`);
  };

  const showToast = (msg: string) => {
    setToastText(msg);
  };

  const renderItem = ({ item }: { item: { id: string; text: string } }) => (
    <SwipeableRow
      id={item.id}
      onDelete={onDelete}
      onEdit={onEdit}
      openRowId={openRowId}
      setOpenRowId={setOpenRowId}
      showToast={showToast}
      renderEditButton={() => <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>编辑</Text>}
      renderDeleteButton={() => <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>删除</Text>}
    >
      <Text style={{ fontSize: 18, paddingVertical: 20, paddingHorizontal: 20 }}>{item.text}</Text>
    </SwipeableRow>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 50 }}>
      <FlatList data={data} keyExtractor={(item) => item.id} renderItem={renderItem} />
      {toastText && <Toast message={toastText} />}
    </GestureHandlerRootView>
  );
}

function Toast({ message }: { message: string }) {
  const opacity = React.useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      RNAnimated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }, 1000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <RNAnimated.View
      style={{
        position: "absolute",
        bottom: 80,
        left: 50,
        right: 50,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <Text style={{ color: "white", fontSize: 14 }}>{message}</Text>
    </RNAnimated.View>
  );
}
