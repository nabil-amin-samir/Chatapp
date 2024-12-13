import React, { useState } from "react";
import { View } from "react-native";
import LoginScreen from "./screens/Login";
import ChatScreen from "./screens/Chat";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {currentUser ? (
        <ChatScreen currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </View>
  );
};

export default App;
