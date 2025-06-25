import { PrismaClient } from "@db/client.ts";
import { withAccelerate } from "@prisma/extension-accelerate";

import { logger } from "./logging.ts";

export const prismaClient = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prismaClient.$extends(withAccelerate());

prismaClient.$on("query", (event) => {
  logger.debug(event);
});

prismaClient.$on("info", (event) => {
  logger.info(event);
});

prismaClient.$on("warn", (event) => {
  logger.warn(event);
});

prismaClient.$on("error", (event) => {
  logger.error(event);
});
