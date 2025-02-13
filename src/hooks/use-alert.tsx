"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AlertContextType {
  message: string;
  setMessage: (message: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  time: number
  setTime: (visible: number) => void;
  type: "success" | "error" | "info" | "warning" | null | undefined;
  setType: (message: "success" | "error" | "info" | "warning" | null | undefined) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [type, setType] = useState<"success" | "error" | "info" | "warning" | null | undefined>("info");

  return (
    <AlertContext.Provider value={{ message, setMessage, visible, setVisible, time, setTime, type, setType }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
