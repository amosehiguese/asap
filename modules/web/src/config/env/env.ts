import { ZodError } from "zod";
import type { IConfig } from "../../interfaces"
import { envSchema, envSchemaType } from "../../schemas"

let env: envSchemaType | null = null;

const productionConfig: IConfig = {
  apiUrl: "",
  aiUrl: "",
  clientUrl: ""
}

const developmentConfig: IConfig = {
  apiUrl: "http://localhost:8080/api/v1",
  aiUrl: "http://localhost:5000",
  clientUrl: "http://localhost:5173"
}


try {
  env = envSchema.parse(import.meta.env)
} catch(error) {
  if (error instanceof ZodError){
    console.error("Environment variable validation error:", error.flatten().fieldErrors);
  } else {
    console.error("Unexpected error during environment variable validation:", error);
  }
}

if (!env) {
  throw new Error("Environment variables validation failed. Application cannot start.");
}

export const config = import.meta.env.MODE === "production" ? productionConfig : developmentConfig;

export { env };


