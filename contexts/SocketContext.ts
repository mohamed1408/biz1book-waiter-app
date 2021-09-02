import { createContext, useContext } from 'react';
import { io, Socket } from "socket.io-client";

export enum Theme {
    Dark = 'dark',
    Light = 'light',
}

export type ThemeContextType = {
    theme: "light" | "dark";
    setTheme: (Theme: Theme) => void;
}

export type WaiterContextType = {
    url: string;
    socket: Socket
}
export const ThemeContext = createContext<ThemeContextType>({ theme: Theme.Dark, setTheme: theme => console.warn('no theme provider')});
export const useTheme = () => useContext(ThemeContext);