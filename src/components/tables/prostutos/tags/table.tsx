"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Delete, Edit2, MoreHorizontal, OctagonX, Plus, ReceiptText, RefreshCcw, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from "react"
import { Produto_tag as Tag } from "@prisma/client"
import { useAlert } from "@/hooks/use-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteTagByIds, getTags } from "@/models/produtos"
import { Paginate } from "../../paginate"



export function TagDataTable({
  header
}: {
  header?: boolean
}) {
  const [sorting, setSorting] = useState<any>([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Tag[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [qtd, setQtd] = useState<number>(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<string>(""); // Estado para o filtro
  const alert = useAlert();

  const [detalhes, setDetalhes] = useState<Tag>();

  // Função para buscar dados do backend
  async function getData() {
    const response = await getTags(
      pagination.pageSize,
      pagination.pageIndex,
      filter, // Passa o filtro
      sorting.length > 0 ? sorting[0].id : "id", // Campo de ordenação
      sorting.length > 0 ? sorting[0].desc ? "desc" : "asc" : "asc" // Ordem
    );

    if (!response.status) {
      alert.setAlert(response.message, response.status ? "success" : "error");
    }

    if (response?.data) {
      setData(response.data.tags);
      setPages(response.data.pages);
      setQtd(response.data.qtd);
    }
  }

  // Atualiza os dados quando a paginação, filtro ou ordenação mudam
  useEffect(() => {
    getData();
    setRowSelection([]);
  }, [pagination, filter, sorting]);

  const columns: ColumnDef<Tag>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <div className="flex w-full justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-text font-bold hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Nome
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-text flex w-full justify-center">{row.getValue("nome")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações Em Massa</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                const selectedId = Object.keys(rowSelection).map((key) => {
                  return data[parseInt(key)].id
                })
                deleteTagByIds(selectedId);
                getData();
              }}><Delete />Deletar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      cell: ({ row }) => {
        const payment = row.original

        const router = useRouter()


        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild
              // onClick={() => setOpenDropdown(!openDropdown)}
              >
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" >
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setDetalhes(payment)}>
                  <ReceiptText /> Detalhes
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-input-border" />
                <DropdownMenuItem onClick={() => router.push(`/admin/produtos/tags/editar/${payment.id}`)}><Edit2 />Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  deleteTagByIds([row.original.id])
                  getData()
                }}><Delete />Deletar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      columnFilters,
      sorting,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pages,
  });

  const router = useRouter();

  return (
    <div className="p-4 bg-background-foreground rounded-md w-full">
      {header && <div className="flex w-full justify-between">
        <span className="text-4xl font-bold" >Tags</span>
        <div className="flex gap-4 font-bold">
          <Button className="w-full"
            onClick={(e) => {
              e.preventDefault();
              router.push("/admin/produtos/tags/cadastro");
            }}
          >
            <Plus />
            Cadastrar
          </Button>
        </div>
      </div >}
      <div className="flex items-center py-4 justify-between gap-4 w-full">
        <Input
          placeholder="Filto Nome e Descrição"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4 justify-center items-center">
          <Dialog onOpenChange={(e) => {
            if (!e) setDetalhes(undefined);
          }}
            open={!!detalhes}>
            <DialogContent className="lg:max-w-[50%] sm:max-w-[70%] h-[90%] max-w-[90%] border-0 bg-transparent p-0 text-text justify-between flex flex-col">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when you're done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Pedro Duarte" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="@peduarte" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here. After saving, you'll be logged out.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="current">Current password</Label>
                        <Input id="current" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new">New password</Label>
                        <Input id="new" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save password</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="ml-auto" onClick={getData}><RefreshCcw /></Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Paginate qtd={qtd} table={table} />
    </div >
  )
}

