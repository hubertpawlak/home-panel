import { DataGridAddButton } from "./DataGridAddButton";
import { DataGridDeleteButton } from "./DataGridDeleteButton";
import { DataGridFooter, DataGridFooterProps } from "./DataGridFooter";
import { SharedModalProps } from "../types/SharedModalProps";
import { useEffect, useState } from "react";
import { UseInfiniteQueryResult, UseMutationResult } from "react-query";
import {
  DataGrid,
  GridColumns,
  GridRowIdGetter,
  GridSelectionModel,
} from "@mui/x-data-grid";

interface UniversalDataGridProps {
  columns: GridColumns<any>;
  infiniteQuery: UseInfiniteQueryResult<any>; // Used to easily fetch data and handle pagination
  getRowId: GridRowIdGetter<any>;
  addText?: string;
  AddModal?: ({ open, setOpen }: SharedModalProps) => JSX.Element;
  editMutation?: UseMutationResult<any, any, any>;
  deleteText?: string;
  deleteMutation?: UseMutationResult<any, any, any>;
}

export const UniversalDataGrid = ({
  columns,
  infiniteQuery,
  getRowId,
  addText,
  AddModal,
  editMutation,
  deleteText,
  deleteMutation,
}: UniversalDataGridProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch: refetchContent,
    remove: removeContent,
  } = infiniteQuery;

  const { mutateAsync: editAsync } = editMutation ?? {};

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>();
  const [visiblePage, setVisiblePage] = useState(0);

  const allFetchedPages = data?.pages ?? [];
  const inOnFirstPage = visiblePage <= 0;
  const isOnLastFetchedPage = visiblePage >= (allFetchedPages.length ?? 0) - 1;
  const rows = allFetchedPages[visiblePage]?.rows ?? []; // Fetched data object must have a "rows" array
  const disableNextButton = !hasNextPage && isOnLastFetchedPage;

  useEffect(() => {
    // Fetch next page in the background
    if (!hasNextPage) return;
    if (!isOnLastFetchedPage) return;
    fetchNextPage();
  });

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      // TODO: translate
      localeText={{ noRowsLabel: "Brak danych" }}
      pageSize={10}
      components={{ Footer: DataGridFooter }}
      componentsProps={{
        footer: {
          addButton: <DataGridAddButton text={addText} Modal={AddModal} />,
          deleteButton: (
            <DataGridDeleteButton
              text={deleteText}
              refetchContent={refetchContent}
              deleteMutation={deleteMutation}
              selectionModel={selectionModel}
            />
          ),
          selectedAmount: selectionModel?.length,
          pages: allFetchedPages.length,
          disabled: [inOnFirstPage, disableNextButton],
          visiblePage,
          setVisiblePage,
        } as DataGridFooterProps,
      }}
      disableSelectionOnClick
      onSelectionModelChange={(newSelectionModel) => {
        setSelectionModel(newSelectionModel);
      }}
      selectionModel={selectionModel}
      onCellEditCommit={(params) => {
        if (!editAsync) return;
        editAsync(params)
          .catch(() => {})
          .finally(() => {
            // refetchContent();
            // FIXME: content not being synced after EDITING
            // edit query data?
            // https://react-query.tanstack.com/guides/mutations
            // https://react-query.tanstack.com/guides/updates-from-mutation-responses
            // https://react-query.tanstack.com/guides/optimistic-updates
            // removeContent();
          });
      }}
      columns={columns}
      rows={rows}
      getRowId={getRowId}
      sx={{ fontFamily: "monospace" }}
    />
  );
};

export default UniversalDataGrid;
