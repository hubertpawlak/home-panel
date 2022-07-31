import { Box } from "@mui/material";
import { DataGridNavButton } from "./DataGridNavButton";
import { Dispatch, SetStateAction } from "react";
import { GridFooterContainer } from "@mui/x-data-grid";
import { Text } from "@mantine/core";

export interface DataGridFooterProps {
  addButton: JSX.Element;
  deleteButton: JSX.Element;
  selectedAmount?: number;
  visiblePage: number;
  pages: number;
  disabled: [previousButton: boolean, nextButton: boolean];
  setVisiblePage: Dispatch<SetStateAction<number>>;
}

export function DataGridFooter({
  addButton,
  deleteButton,
  selectedAmount,
  visiblePage,
  pages,
  disabled,
  setVisiblePage,
}: DataGridFooterProps) {
  return (
    <GridFooterContainer>
      <Box display="flex" alignItems="center">
        {addButton}
        {!!selectedAmount && (
          <>
            {deleteButton}
            <Text ml="xs" size="sm">
              Zaznaczone: {selectedAmount ?? 0}
            </Text>
          </>
        )}
      </Box>
      <Box display="flex" alignItems="center">
        {/* Render counter only if there is at least one page */}
        {pages > 0 && (
          <Text component="span" mx="xs" size="sm">
            Strona {visiblePage + 1}/{pages}
          </Text>
        )}
        {/* Previous page */}
        <DataGridNavButton
          disabled={disabled[0]}
          setVisiblePage={setVisiblePage}
        />
        {/* Next page */}
        <DataGridNavButton
          disabled={disabled[1]}
          setVisiblePage={setVisiblePage}
          next
        />
      </Box>
    </GridFooterContainer>
  );
}
