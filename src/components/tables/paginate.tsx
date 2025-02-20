import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function Paginate(props: {
  table: any
  qtd: number
}) {
  return (<div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex-1 text-sm text-muted-foreground">
      {props.table.getFilteredSelectedRowModel().rows.length} de{" "}
      {props.qtd} row(s) selected.
    </div>
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Linhas por pagina</p>
      <Select value={`${props.table.getState().pagination.pageSize}`} onValueChange={value => {
        props.table.setPageSize(Number(value));
      }}>
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={props.table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 20, 30, 40, 50].map(pageSize => <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize}
          </SelectItem>)}
        </SelectContent>
      </Select>
    </div>
    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
      Page {props.table.getState().pagination.pageIndex + 1} of{" "}
      {props.table.getPageCount()}
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => props.table.setPageIndex(0)} disabled={!props.table.getCanPreviousPage()}>
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft />
      </Button>
      <Button variant="outline" className="h-8 w-8 p-0" onClick={() => props.table.previousPage()} disabled={!props.table.getCanPreviousPage()}>
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft />
      </Button>
      <Button variant="outline" className="h-8 w-8 p-0" onClick={() => props.table.nextPage()} disabled={!props.table.getCanNextPage()}>
        <span className="sr-only">Go to next page</span>
        <ChevronRight />
      </Button>
      <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => props.table.setPageIndex(props.table.getPageCount() - 1)} disabled={!props.table.getCanNextPage()}>
        <span className="sr-only">Go to last page</span>
        <ChevronsRight />
      </Button>
    </div>
  </div>);
}