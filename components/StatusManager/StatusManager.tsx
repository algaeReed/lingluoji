import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, List, Modal, Portal, Text, useTheme } from "react-native-paper";

// 类型定义
type Status = string;
type StatusManagerProps = {
  maxCount?: number;
  maxLength?: number;
};

// 推荐状态列表
const RECOMMENDED_STATUSES: Status[] = [
  "开心",
  "忙碌",
  "学习中",
  "摸鱼",
  "出差",
  "休假",
  // "健身",
  // "开会",
  // "在线",
  // "勿扰",
  // "吃饭",
  // "睡觉",
  // " coding",
  // "旅行",
  // "生病",
  // "恋爱中",
  // "发呆",
  // "充电",
  // "看电影",
  // "听歌",
];

const StatusManager: React.FC<StatusManagerProps> = ({ maxCount = 3, maxLength = 5 }) => {
  // 使用 Paper 主题
  const theme = useTheme();
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [inputStatus, setInputStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState<number | null>(null);

  // 加载保存的状态
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const saved = await AsyncStorage.getItem("user_statuses");
        if (saved) setStatusList(JSON.parse(saved));
      } catch (e) {
        console.error("加载状态失败", e);
      }
    };
    loadStatuses();
  }, []);

  // 保存状态
  useEffect(() => {
    const saveStatuses = async () => {
      try {
        await AsyncStorage.setItem("user_statuses", JSON.stringify(statusList));
      } catch (e) {
        console.error("保存状态失败", e);
      }
    };
    saveStatuses();
  }, [statusList]);

  // 添加状态
  const addStatus = (status: Status) => {
    if (
      status.trim() === "" ||
      statusList.includes(status) ||
      statusList.length >= maxCount ||
      status.length > maxLength
    ) {
      return;
    }
    setStatusList([...statusList, status]);
    setInputStatus("");
    setShowModal(false);
  };

  // 删除状态
  const removeStatus = (index: number) => {
    setStatusList(statusList.filter((_, i) => i !== index));
    setShowDelete(null);
  };

  // 状态标签组件
  const StatusBadge = ({ status, index }: { status: Status; index: number }) => {
    const scaleAnim = new Animated.Value(1);

    const handleLongPress = () => {
      setShowDelete(index);
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity onLongPress={handleLongPress} delayLongPress={500} activeOpacity={0.7}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={[styles.badgeContainer, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>{status}</Text>
            {showDelete === index && (
              <TouchableOpacity
                style={[styles.deleteIcon, { backgroundColor: theme.colors.error }]}
                onPress={() => removeStatus(index)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 状态标签区 */}
      <View style={styles.statusContainer}>
        {statusList.map((status, index) => (
          <StatusBadge key={index} status={status} index={index} />
        ))}
        <Button
          mode='outlined'
          style={styles.addButton}
          onPress={() => setShowModal(true)}
          disabled={statusList.length >= maxCount}
          theme={{ colors: { primary: theme.colors.primary } }}
        >
          状态{statusList.length > 0 ? `(${statusList.length}/${maxCount})` : ""}
        </Button>
      </View>

      {/* 添加状态弹窗 */}
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>添加状态</Text>

          {/* 输入框 */}
          <View style={[styles.inputContainer, { borderBottomColor: theme.colors.outline }]}>
            <TextInput
              style={[styles.input, { color: theme.colors.onBackground }]}
              value={inputStatus}
              onChangeText={setInputStatus}
              placeholder='输入状态（最多5字）'
              placeholderTextColor={theme.colors.outline}
              maxLength={maxLength}
            />
            {inputStatus.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setInputStatus("")}>
                <Text style={{ color: theme.colors.outline }}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 推荐列表 */}
          {inputStatus.length === 0 && (
            <List.Section>
              <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>推荐状态</List.Subheader>
              {RECOMMENDED_STATUSES.map((status, index) => (
                <List.Item
                  key={index}
                  title={status}
                  titleStyle={{ color: theme.colors.onBackground }}
                  onPress={() => addStatus(status)}
                  left={() => <List.Icon icon='lightbulb-outline' color={theme.colors.primary} />}
                />
              ))}
            </List.Section>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

// 样式表
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 14,
    includeFontPadding: false,
  },
  deleteIcon: {
    marginLeft: 4,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 10,
    lineHeight: 16,
  },
  addButton: {
    borderRadius: 16,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 8,
  },
});

export default StatusManager;
