import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  ALLOWED_ORIGINS: z
    .string()
    .default('["http://localhost:5173"]')
    .transform((value) => JSON.parse(value))
    .pipe(z.array(z.string().url())),
  JWT_SECRET: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const result = EnvSchema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid environment variables: ");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
