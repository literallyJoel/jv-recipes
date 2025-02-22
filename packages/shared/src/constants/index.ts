import { z } from "zod";

export const unused = z.string().describe(
  `
    Currently only static assets are exported from the shared lib.
    The code scaffold is here for future use.
  `,
);
