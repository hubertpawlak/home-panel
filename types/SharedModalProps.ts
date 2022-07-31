import { Dispatch, SetStateAction } from "react";

export interface SharedModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
