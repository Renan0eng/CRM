"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Delete, Edit2, MoreHorizontal, OctagonX, ReceiptText, RefreshCcw } from "lucide-react"

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
import { Tanque } from "@prisma/client"
import { useAlert } from "@/hooks/use-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteTanqueByIds, getTanques } from "@/models/tanque"



export function TanqueDataTable() {
  const [sorting, setSorting] = useState<any>([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Tanque[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [qtd, setQtd] = useState<number>(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<string>(""); // Estado para o filtro
  const alert = useAlert();

  const [detalhes, setDetalhes] = useState<Tanque>();

  // Função para buscar dados do backend
  async function getData() {
    const response = await getTanques(
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
      setData(response.data.tanques);
      setPages(response.data.pages);
      setQtd(response.data.qtd);
    }
  }

  // Atualiza os dados quando a paginação, filtro ou ordenação mudam
  useEffect(() => {
    getData();
    setRowSelection([]);
  }, [pagination, filter, sorting]);

  const columns: ColumnDef<Tanque>[] = [
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
      accessorKey: "kg",
      header: ({ column }) => {
        return (
          <div className="flex w-full justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-text font-bold hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Kg
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-text flex w-full justify-center">{row.getValue("kg")}</div>,
    },
    {
      accessorKey: "qtd",
      header: ({ column }) => {
        return (
          <div className="flex w-full justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-text font-bold hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Quantidade
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-text flex w-full justify-center">{row.getValue("qtd")}</div>,
    },
    {
      accessorKey: "area",
      header: ({ column }) => {
        return (
          <div className="flex w-full justify-center">
            <Button
              variant="ghost"
              className="text-primary hover:text-text font-bold hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Área
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-text flex w-full justify-center">{row.getValue("area")}</div>,
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
                deleteTanqueByIds(selectedId);
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
                <DropdownMenuItem onClick={() => router.push(`/admin/tanques/editar/${payment.id}`)}><Edit2 />Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  deleteTanqueByIds([row.original.id])
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



  return (
    <div className="p-4 bg-background-foreground rounded-md w-full">
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
              {/* <DialogHeader className="flex flex-col gap-4">
                <DialogTitle className="text-2xl">{detalhes?.nome}</DialogTitle>
                <DialogDescription className="text-text-foreground font-normal">
                  {detalhes?.descricao}
                </DialogDescription>
              </DialogHeader>
              <div>
                
              </div> */}
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
              {/* <DialogFooter >
                <div className="flex  w-full flex-row-reverse">
                  <Button onClick={() => setDetalhes(undefined)}>Exportar</Button>
                </div>
              </DialogFooter> */}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {qtd} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Linhas por pagina</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div >
  )
}

