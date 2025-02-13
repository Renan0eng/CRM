import { cva, type VariantProps } from "class-variance-authority";
import { cn, formatTimestampToDateTime } from "@/lib/utils";
import { Apple, BadgeX, Clapperboard, File, Globe, Image, Mic, Smartphone, Smile, Sticker } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ItemChat({
  item,
}: {
  item: Message
}) {

  const messageVariants = cva(
    "text-sm p-2 rounded-xl font-medium w-full text-text relative",
    {
      variants: {
        sender: {
          true: "bg-background-whatsapp-user before:content-[''] before:absolute before:right-[-5px] before:top-[10px] before:w-3 before:h-3 before:bg-background-whatsapp-user before:rotate-45",
          false: "bg-background-whatsapp-from before:content-[''] before:absolute before:left-[-6px] before:top-[10px] before:w-3 before:h-3 before:bg-background-whatsapp-from before:rotate-45",
        },
      },
      defaultVariants: {
        sender: false,
      },
    }
  );


  const mainVariants = cva(
    "flex gap-2",
    {
      variants: {
        sender: {
          true: "flex-row-reverse",
          false: "flex-row",
        },
      },
      defaultVariants: {
        sender: false,
      },
    }
  );

  const IconVariants = cva(
    "flex w-full",
    {
      variants: {
        sender: {
          true: "flex-row-reverse",
          false: "flex-row",
        },
      },
      defaultVariants: {
        sender: false,
      },
    }
  );

  const messageMainVariants = cva(
    "flex flex-col max-w-[80%]",
    {
      variants: {
        sender: {
          true: "items-end",
          false: "items-start",
        },
      },
      defaultVariants: {
        sender: false,
      },
    }
  );

  const renderMessageContent = (item: Message) => {
    switch (item.type) {
      case "image":
        // Renderizando imagem recebida
        return (
          <Image className="text-primary" />
        );

      case "document":
        // Renderizando documento com ícone e nome
        return (
          <File className="text-primary" />
        );

      case "video":
        // Renderizando vídeo com player
        return (
          <Clapperboard className="text-primary" />
        );

      case "ptt":
        // Renderizando áudio com player
        return (
          <Mic className="text-primary" />
        );

      case "sticker":
        // Renderizando figurinha
        return (
          <Sticker className="text-primary" />
        );

      case "revoked":
        // Renderizando enquete com opções
        return (
          <div className="text-text-foreground flex justify-center items-center gap-2">
            <BadgeX /><p className="text-sm">Mensagem apagada</p>
          </div>
        );

      default:
        // Renderizando tipo desconhecido
        return <p className="text-sm">{item.body}</p>;
    }
  };



  const getDevice = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "ios":
        return <Apple strokeWidth="xs" className="text-blue-500" />;
      case "android":
        return <Smartphone strokeWidth="xs" className="text-green-500" />;
      case "web":
        return <Globe strokeWidth="xs" className="text-gray-500" />;
      default:
        return <Smile strokeWidth="xs" className="text-yellow-500" />;
    }
  };



  return (
    <div
      className={cn(mainVariants({ sender: item.fromMe }))}
    >
      {/* Foto de perfil */}
      {/* <div
        style={{
          backgroundImage: `url(${item.profilePictureUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-12 h-12 bg-zinc-500 rounded-full"
      /> */}
      <Avatar>
        <AvatarImage src={item.userData.profilePictureUrl} />
        <AvatarFallback>{item.userData.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className={cn(IconVariants({ sender: item.fromMe }))}>
        {/* Mensagem */}
        <div className={cn(messageMainVariants({ sender: item.fromMe }))}>
          <p className={cn(messageVariants({ sender: item.fromMe }))}>
            {renderMessageContent(item)}
          </p>
          <p className="text-xs">{formatTimestampToDateTime(item.timestamp)}</p>
        </div>
        {/* Botão de Smile */}
        <div>
          <Button
            size="icon"
            variant="ghost"
            className="inset-y-0 left-2 flex items-center z-20 cursor-pointer [&_svg]:size-4 rounded-full hover:bg-transparent hover:text-primary"
          >
            {getDevice(item.deviceType)}
          </Button>
        </div>
      </div>
    </div>
  );
}