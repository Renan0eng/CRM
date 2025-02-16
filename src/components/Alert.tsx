"use client";
import { useAlert } from "@/hooks/use-alert";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect } from "react";

// Definindo as variantes de alerta
const alertVariants = cva("absolute top-4 right-4 z-50 w-80 p-4 bg-yellow-200 border border-yellow-500 rounded-lg shadow-lg", {
  variants: {
    type: {
      success: "bg-green-200 border border-green-500 text-green-800",
      error: "bg-red-200 border border-red-500 text-red-800",
      info: "bg-blue-200 border border-blue-500 text-blue-800",
      warning: "bg-yellow-200 border border-yellow-500 text-yellow-800",
    },
  },
  defaultVariants: {
    type: "info", // Padrão do alerta
  },
});

export function GlobalAlert() {
  const { message, visible, setVisible, time, setTime, type } = useAlert();

  // Efeito para esconder o alerta após o tempo configurado
  useEffect(() => {
    if (visible && time) {
      const timer = setTimeout(() => {
        setVisible(false); // Fecha o alerta após o tempo configurado
        setTime(0);
      }, time); // Tempo de duração do alerta

      // Limpeza do timer se o componente for desmontado antes do tempo
      return () => clearTimeout(timer);
    }
  }, [visible, time, setVisible, setTime]);

  if (!visible) return null; // Não exibe se o alerta não estiver visível

  return (
    <Alert className={alertVariants({ type })}> {/* Aplica a variante do tipo */}
      <Terminal className="h-4 w-4" />
      <AlertTitle className="font-bold text-neutral-800">Atenção !!</AlertTitle>
      <AlertDescription className="font-bold text-neutral-800">{message}</AlertDescription>
      <button
        onClick={() => setVisible(false)} // Função para esconder o alerta
        className="absolute top-0 right-0 p-2 text-xl text-gray-700 hover:text-gray-900"
      >
        X
      </button>
    </Alert>
  );
}
