// Licensed under the Open Software License version 3.0
import { createGetInitialProps } from "@mantine/next";
import Document from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;
}
