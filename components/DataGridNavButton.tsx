import { Dispatch, SetStateAction } from "react";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

interface IDataGridNavButton {
  next?: boolean;
  disabled: boolean;
  setVisiblePage: Dispatch<SetStateAction<number>>;
}

export function DataGridNavButton({
  next,
  disabled,
  setVisiblePage,
}: IDataGridNavButton) {
  return (
    <Tooltip
      title={next ? "Następna strona" : "Poprzednia strona"}
      arrow
      placement="bottom"
      TransitionComponent={Zoom}
    >
      <span>
        <IconButton
          edge={next && "start"}
          disabled={disabled}
          onClick={() => {
            setVisiblePage((page) => (next ? page + 1 : page - 1));
          }}
        >
          {next ? <NavigateNext /> : <NavigateBefore />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
