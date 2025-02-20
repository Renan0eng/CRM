import { Grid3X3, ListOrdered, ShoppingCart, Wrench } from "lucide-react";

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Ferramentas",
      url: "#",
      icon: Wrench,
      isActive: false,
      items: [
        // {
        //   title: "WhatsApp",
        //   url: "/ferramentas/whatsapp",
        //   icon: SquareTerminal,
        // },
        // {
        //   title: "Calendario",
        //   url: "/ferramentas/calendar",
        // },
        {
          title: "Scrumboard",
          url: "/admin/ferramentas/scrumboard",
        },
      ],
    },
    {
      title: "Lotes",
      url: "/admin/lotes",
      icon: ListOrdered,
      items: [
        {
          title: "Cadastro",
          url: "/admin/lotes/cadastro",
        },
      ],
    },
    {
      title: "Tanques",
      url: "/admin/tanques",
      icon: Grid3X3,
      items: [
        {
          title: "Cadastro",
          url: "/admin/tanques/cadastro",
        },
      ],
    },
    {
      title: "Produtos",
      url: "/admin/produtos",
      icon: ShoppingCart,
      items: [
        {
          title: "Cadastro",
          url: "/admin/produtos/cadastro",
        },
        {
          title: "Cadastro Movimentos",
          url: "/admin/produtos/movimentos/cadastro",
        },
        {
          title: "Cadastro Tags",
          url: "/admin/produtos/tags/cadastro",
        },
      ],
    },
  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
  ],
};
