import { AddCircle } from "@mui/icons-material";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { SharedModalProps } from "../types/SharedModalProps";
import { useState } from "react";

interface DataGridAddButtonProps {
  text?: string;
  Modal?: ({}: SharedModalProps) => JSX.Element;
}

export const DataGridAddButton = ({ text, Modal }: DataGridAddButtonProps) => {
  const [open, setOpen] = useState(false);

  // Don't render button if adding isn't possible
  if (!Modal) return null;

  return (
    <>
      <Tooltip
        title={text ?? "Dodaj"}
        arrow
        placement="bottom"
        TransitionComponent={Zoom}
      >
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddCircle />
        </IconButton>
      </Tooltip>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
};
