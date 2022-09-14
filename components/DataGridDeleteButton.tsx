import { DeleteForever } from "@mui/icons-material";
import { GridSelectionModel } from "@mui/x-data-grid";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { UseMutationResult } from "react-query";

interface DataGridDeleteButtonProps {
  text?: string;
  deleteMutation?: UseMutationResult<any, any, any>;
  refetchContent?: () => Promise<any>;
  selectionModel?: GridSelectionModel;
}

export const DataGridDeleteButton = ({
  text,
  deleteMutation,
  refetchContent,
  selectionModel,
}: DataGridDeleteButtonProps) => {
  // Don't render delete button if deletion isn't possible
  if (!deleteMutation) return null;

  const { mutateAsync, isLoading } = deleteMutation ?? {};

  return (
    <Tooltip
      title={text ?? "Usuń zaznaczone"}
      arrow
      placement="bottom"
      TransitionComponent={Zoom}
    >
      <IconButton
        disabled={isLoading}
        onClick={() => {
          // Call delete function and refetch content afterwards
          if (!mutateAsync) return;
          mutateAsync(selectionModel)
            .then(() => {
              if (!refetchContent) return;
              refetchContent();
            })
            .catch(() => {});
        }}
      >
        <DeleteForever />
      </IconButton>
    </Tooltip>
  );
};
