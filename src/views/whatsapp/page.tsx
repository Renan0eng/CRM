'use client'
import { Button } from "@/components/ui/button";

import { EllipsisVertical } from "lucide-react";

import { ItemChat } from "@/components/chat/item-chat";
import { InputChat } from "@/components/chat/input-chat";
import { SideBar } from "@/components/chat/side-bar";
import { useEffect, useState } from "react";

export default function Whatsapp() {

  const [users, setUsers] = useState([]);

  const [user, setUser] = useState<User>();

  const [privateChat, setPrivateChat] = useState<PrivateChat>();

  const [privateChatMessages, setPrivateChatMessages] = useState<Message[]>([]);

  const [allData, setAllData] = useState<PrivateChat[]>([])

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [privateChatId, setPrivateChatId] = useState("554491571020@c.us");

  const handleFetchMessages = () => {
    console.log("privateChatId", privateChatId);

    console.log('allData', allData);

    if (allData) {
      const selectedContact = allData.find((contact: { id: string }) => contact.id === privateChatId);

      if (selectedContact) {
        setPrivateChat(selectedContact);
        setPrivateChatMessages(selectedContact.messages)
      } else {
        console.log("Contato não encontrado");
      }
    }
  };

  // Chama a função ao selecionar um contato ou quando necessário
  useEffect(() => {
    handleFetchMessages();
  }, [privateChatId]);

  const initializeWebSocket = () => {
    // Cria uma nova instância do WebSocket
    const ws = new WebSocket("ws://localhost:8000/websocket");

    ws.onopen = () => {
      console.log("Conectado ao WebSocket");
      ws.send(
        JSON.stringify({
          action: "getContacts",
          clientId: 1, // Envia o clientId
        })
      );
      ws.send(
        JSON.stringify({
          action: "getAlldata",
          clientId: 1,
        })
      );
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "getLastMessages") {
        console.log("Últimas mensagens recebidas:", data);
        setPrivateChatMessages(data.messages);

      }
      if (data.action === "getContacts" && data.success) {
        setUsers(data.contacts);
      }
      if (data.action === "getAlldata") {
        console.log("Dados completos recebidos:", data.contactsWithMessages);
        // Atualize o estado com os dados recebidos
        setAllData(data.contactsWithMessages);
        setUser(data.myData);
      }
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada");
      // Tentativa de reconectar em caso de fechamento
      setTimeout(() => {
        console.log("Tentando reconectar ao WebSocket...");
        initializeWebSocket(); // Reconectar ao WebSocket
      }, 5000); // Espera 5 segundos antes de tentar reconectar
    };
  };

  useEffect(() => {
    // Inicia a primeira conexão WebSocket
    initializeWebSocket();
    // Lembre-se de limpar a conexão ao fechar o componente
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);


  return (
    <div className="w-full h-[calc(100vh-84px)]">
      <div className="w-full h-full flex p-6 gap-5 ">
        {/* Side bar */}
        <SideBar users={users} user={user} setPrivateChatId={setPrivateChatId} privateChatId={privateChatId} />
        {/* Main chat */}
        <div className="flex-1 flex shadow-custom rounded-md text-text bg-background-foreground flex-col">
          {/* Header */}
          <div className="w-full h-fit flex justify-between items-center p-4 px-5">
            {/* Nomes e foto */}
            <div className="flex flex-row justify-center items-center ">
              {/* foto */}
              <div
                style={{
                  backgroundImage: `url(${privateChat?.profilePictureUrl})`, // Use crases e certifique-se do formato correto
                  backgroundSize: "cover", // Ajusta o tamanho para cobrir o elemento
                  backgroundPosition: "center", // Centraliza a imagem no círculo
                }}
                className="w-12 h-12 rounded-full "
              ></div>
              {/* nome */}
              <div className="flex flex-col ms-3 gap-1">
                <span className="font-semibold text-sm">{privateChat?.name}</span>
                <span className="text-xs">{privateChat?.status}</span>
              </div>
            </div>
            {/* Botão actions */}
            <Button variant="ghost" size="icon" className="rounded-full">
              <EllipsisVertical />
            </Button>
          </div>
          <hr className="border-background-white" />
          {/* Messages  */}
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto scrollable">
            {privateChatMessages?.map((item) =>
              <ItemChat item={item} />
            )}
          </div>
          {/* Input buttons*/}
          <InputChat chatId={privateChatId}
            clientId={1}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
}



