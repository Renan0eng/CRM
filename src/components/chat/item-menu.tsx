import { formatDate, truncateText } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export function ItemMenu({ key, user, setPrivateChatId, privateChatId }: {

  user: {
    profilePicUrl: string; lastMessage: string; name: string; lastMessageDate: string; id: string;
  },
  setPrivateChatId: Dispatch<SetStateAction<string>>,
  privateChatId: string,
  key: number
}) {

  return <div key={key} className="w-full h-fit flex justify-between items-center p-2"
    onClick={() => {
      setPrivateChatId(user.id);
      console.log("AAAAAAAA", user.id);

    }}
  >
    {/* Nomes e foto */}
    <div className="flex flex-row justify-center items-center">
      {/* Foto */}
      <div
        style={{
          backgroundImage: `url(${user.profilePicUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-12 h-12 bg-zinc-500 rounded-full"
      ></div>
      {/* Nome */}
      <div className="flex flex-col ms-3 gap-1">
        <span className="font-semibold text-sm">{user.name}</span>
        <span className="text-xs">{truncateText(user.lastMessage, 20)}</span>

      </div>
    </div>
    {/* Time */}
    <p className="text-xs font-semibold">{formatDate(user.lastMessageDate)}</p>
  </div>;
}