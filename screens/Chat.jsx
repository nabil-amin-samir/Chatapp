import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MESSAGE_STORAGE_KEY = "chat_messages";

const ChatScreen = ({ currentUser, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(MESSAGE_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      sender: { id: currentUser.id, name: currentUser.name },
      content: input,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../assets/HomeImage2.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                Chatting as {currentUser.name}
              </Text>
              <Text style={styles.messageCountText}>
                {messages.length} Messages
              </Text>
              <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={messages}
              inverted
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.message,
                    item.sender.id === currentUser.id
                      ? styles.sent
                      : styles.received,
                  ]}
                >
                  <Text>
                    {item.sender.name}: {item.content}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              )}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message"
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    margin: 20,
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  messageCountText: { fontSize: 14, color: "#add8e6" },
  logoutButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  logoutButtonText: { color: "white", fontWeight: "bold" },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sent: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  received: { backgroundColor: "#ECECEC", alignSelf: "flex-start" },
  timestamp: { fontSize: 10, color: "gray", textAlign: "right" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    backgroundColor: "white",
  },
});

export default ChatScreen;
