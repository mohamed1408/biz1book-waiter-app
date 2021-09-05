import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { io, Socket } from "socket.io-client";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { ThemeContext, Theme, SocketContext, SocketUrlContext } from './contexts/context'

export default function App() {
  const [theme, setTheme] = React.useState(Theme.Light);
  const [url, setUrl] = React.useState("http://192.168.1.6:8000");
  const [socket, connect] = React.useState(io(url));
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // const socket: Socket = io("http://192.168.1.3:8000")
  // connect()
  socket.on("connect", () => {
    console.log("android connected to socket io")
  })
  socket.on("connectedusers", (users) => {
    console.log("users", url)
  })
  socket.on("testback", (data) => {
    console.log("testback",data)
  })

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SocketUrlContext.Provider value={{url, setUrl}}>
        <SocketContext.Provider value={{ socket, connect }}>
          <SafeAreaProvider>
            <Navigation colorScheme={theme} />
            <StatusBar />
          </SafeAreaProvider>
        </SocketContext.Provider>
      </SocketUrlContext.Provider>
    );
  }
}
