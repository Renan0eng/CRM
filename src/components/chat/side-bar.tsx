import { Ellipsis, MessageSquareDot, Search, Send, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ItemMenu } from "./item-menu";
import { Dispatch, SetStateAction } from "react";

export function SideBar({ user, users, setPrivateChatId, privateChatId }: {
  users: {
    profilePicUrl: string; lastMessage: string; name: string; lastMessageDate: string; id: string
  }[],
  user: User | undefined,
  setPrivateChatId: Dispatch<SetStateAction<string>>,
  privateChatId: string
}) {
  return <div className="w-80 flex shadow-custom rounded-md p-4 bg-ba flex-col gap-4">
    {/* Dados pessoais */}
    <div className="w-full h-fit flex justify-between items-center">
      {/* Nomes e foto */}
      <div className="flex flex-row justify-center items-center">
        {/* foto */}
        <div
          style={{
            backgroundImage: `url(${user?.profilePictureUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-12 h-12 bg-zinc-500 rounded-full"
        ></div>
        {/* nome */}
        <div className="flex flex-col ms-3 gap-1">
          <span className="font-semibold text-sm text-text">{user?.name}</span>
          <span className="text-xs text-text">{user?.phone}</span>
        </div>
      </div>
      {/* Botão actions */}
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-transparent">
        <Ellipsis size={'md'} />
      </Button>
    </div>
    <div className="w-full relative">
      <Input type="text" placeholder="Pesquisar..." />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <Search strokeWidth="sm" />
      </div>
    </div>
    <div className="flex justify-around text-text">
      <div className="hover:text-red-500 justify-center items-center text-center flex flex-col">
        <MessageSquareDot strokeWidth="sm" />
        <p className="text-xs">Chats</p>
      </div>
      <div className="hover:text-red-500 justify-center items-center text-center flex flex-col">
        <Send strokeWidth="sm" />
        <p className="text-xs">Send</p>
      </div>
      <div className="hover:text-red-500 justify-center items-center text-center flex flex-col">
        <UserPlus strokeWidth="sm" />
        <p className="text-xs">Contacts</p>
      </div>
    </div>
    <div className="w-full flex flex-col gap-1 overflow-auto border-t-background-white border-t-[0.5px] scrollable text-text">
      {users.map((user, index) => (
        <ItemMenu key={index} user={user} setPrivateChatId={setPrivateChatId} privateChatId={privateChatId} />
      ))}
    </div>
  </div>;
}