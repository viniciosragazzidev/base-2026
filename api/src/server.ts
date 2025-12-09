import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import { fastifySwagger } from "@fastify/swagger";

import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "./lib/auth";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configure CORS
app.register(fastifyCors, {
  origin: [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3333",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API Model Backend Geral",
      description: "Model geral to next projects with Better Auth integration",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

// Better Auth handler - mount auth routes
app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v.toString()));
          } else {
            headers.append(key, value.toString());
          }
        }
      });

      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body:
          request.method !== "GET" && request.body
            ? JSON.stringify(request.body)
            : undefined,
      });

      // Process authentication request
      const response = await auth.handler(req);

      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));

      const responseBody = response.body ? await response.text() : null;
      reply.send(responseBody);
    } catch (error) {
      app.log.error(`Authentication Error: ${String(error)}`);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

// Health check endpoint
app.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("🚀 Nice! Server start in http://localhost:3333");
    console.log("📚 Docs available in http://localhost:3333/docs");
    console.log(
      "🔐 Auth endpoints available at http://localhost:3333/api/auth/*",
    );
  });
