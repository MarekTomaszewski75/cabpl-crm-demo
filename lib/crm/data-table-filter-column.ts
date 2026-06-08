import type { ColumnDef } from "@tanstack/react-table"

/** Ukryta kolumna do wyszukiwania w toolbarze DataTable. */
export function createFilterSearchColumn<TData extends { _filter: string }>(): ColumnDef<TData> {
  return {
    accessorKey: "_filter",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      const haystack = String(row.getValue(id) ?? "").toLowerCase()
      const query = String(value ?? "").toLowerCase().trim()
      if (!query) return true
      return haystack.includes(query)
    },
  }
}
