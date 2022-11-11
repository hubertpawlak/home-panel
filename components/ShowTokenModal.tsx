// Licensed under the Open Software License version 3.0
import {
  ActionIcon,
  CopyButton,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { Check, Copy } from "tabler-icons-react";

type ShowTokenProps = ContextModalProps<{ token: string }>;

export const ShowTokenModal = ({ innerProps }: ShowTokenProps) => {
  const { token } = innerProps;

  return (
    <Stack>
      <TextInput
        readOnly
        label="Token M2M"
        value={token}
        rightSection={
          <CopyButton value={token} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Skopiowano" : "Kopiuj"}
                withArrow
                position="right"
              >
                <ActionIcon color={copied ? "teal.8" : "dark.0"} onClick={copy}>
                  {copied ? <Check /> : <Copy />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
      />
      <Text size="sm" align="justify">
        Po zamknięciu okna nie będzie możliwe jego ponowne wyświetlenie. Skopiuj
        go do pliku konfiguracyjnego. Pamiętaj o&nbsp;zabezpieczeniu pliku przed
        nieautoryzowanym odczytem. Pod żadnym pozorem nie dziel się nim
        z&nbsp;innymi! Wygenerowany sekret umożliwia interakcję źródła danych
        z&nbsp;serwerem.
      </Text>
    </Stack>
  );
};

export default ShowTokenModal;
