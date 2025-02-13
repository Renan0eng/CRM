import { Send, Smile, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { useAlert } from "@/hooks/use-alert";

export function InputChat({
  chatId,
  clientId,
  socket,
}: {
  chatId: string;
  socket: WebSocket | null;
  clientId: number;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMessage: setAlertMessage, setVisible: setAlertVisible, setTime: setAlertTime, setType: setAlertType } = useAlert();

  const handleSendMessage = () => {
    if (message.trim() === "") {
      setAlertMessage("Por favor, digite uma mensagem.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    if (socket && socket.readyState === WebSocket.OPEN) {
      // Envia a mensagem para o servidor WebSocket
      socket.send(
        JSON.stringify({
          action: "send-message", // Identificador da ação
          clientId,               // ID do cliente
          contactId: chatId,      // ID do contato com quem a mensagem está sendo enviada
          message,                // Conteúdo da mensagem
        })
      );

      // Espera pela resposta e atualiza o estado
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.success) {
          setAlertType("success");
          setAlertTime(5000);
          setAlertVisible(true);
          setAlertMessage(data.message || "Mensagem enviada com sucesso!");
          setMessage("");
        } else {
          setAlertMessage(data.message || "Erro ao enviar mensagem.");
          setAlertVisible(true);
        }
      };
    } else {
      setAlertMessage("Erro: WebSocket não está conectado.");
      setAlertVisible(true);
    }

    setLoading(false);
  };

  // Função para enviar a mensagem quando a tecla Enter é pressionada
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full p-4 flex gap-3">
      {/* Campo de input */}
      <div className="w-full relative">
        <Input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => {
            console.log("message.length", message.length == 0);
            if (message.length == 0) {
              console.log("Asdasreas");

              const inputValue = e.target.value;
              const formattedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
              setMessage(formattedValue);
              return;
            }
            setMessage(e.target.value);
          }}
          onKeyDown={handleKeyDown} // Adicionando o manipulador para a tecla Enter
          className="rounded-full p-4 pl-12 pr-12 z-10 focus:outline-0" // Adicionando padding à esquerda e à direita
        />

        {/* Ícone de Smile à esquerda */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute inset-y-0 left-2 flex items-center z-20 cursor-pointer [&_svg]:size-6 rounded-full hover:bg-transparent hover:text-primary"
        >
          <Smile strokeWidth="sm" />
        </Button>

        {/* Ícone de Enviar à direita */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute inset-y-0 right-4 flex items-center z-20 cursor-pointer [&_svg]:size-6 rounded-full hover:bg-transparent hover:text-primary"
          onClick={handleSendMessage} // Função para enviar a mensagem
          disabled={loading} // Desabilita o botão enquanto a mensagem está sendo enviada
        >
          <Send strokeWidth="sm" />
        </Button>
      </div>

      {/* Botão de Upload */}
      <Button size="icon" variant="outline" className="rounded-full">
        <Upload />
      </Button>
    </div>
  );
}
