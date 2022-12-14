// Licensed under the Open Software License version 3.0
import { Container, Text, Title } from "@mantine/core";

export const RoleAccessDenied = () => (
  <Container size="xl">
    <Title align="center">Odmowa dostępu</Title>
    <Text>
      Ta strona jest widoczna tylko dla użytkowników o wyższych uprawnieniach
    </Text>
  </Container>
);
