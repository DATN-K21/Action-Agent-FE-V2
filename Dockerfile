# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Inject build-time environment variables directly (for CI/CD)
ARG NEXT_PUBLIC_USER_API__V1_ENDPOINT
ARG NEXT_PUBLIC_AI_API__V1_ENDPOINT
ARG NEXT_PUBLIC_AI_API__V2_ENDPOINT
ARG NEXT_PUBLIC_EXTENSION_API__V1_ENDPOINT
ARG NEXT_PUBLIC_VOICE_API__V1_ENDPOINT
ARG NEXT_PUBLIC_PAYMENT_API__V1_ENDPOINT
ARG NEXT_PUBLIC_SCHEDULER_API__V1_ENDPOINT
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Write envs to .env for Next.js build
RUN \
     echo "NEXT_PUBLIC_USER_API__V1_ENDPOINT=$NEXT_PUBLIC_USER_API__V1_ENDPOINT" > .env \
  && echo "NEXT_PUBLIC_AI_API__V1_ENDPOINT=$NEXT_PUBLIC_AI_API__V1_ENDPOINT" >> .env \
  && echo "NEXT_PUBLIC_AI_API__V2_ENDPOINT=$NEXT_PUBLIC_AI_API__V2_ENDPOINT" >> .env \
  && echo "NEXT_PUBLIC_EXTENSION_API__V1_ENDPOINT=$NEXT_PUBLIC_EXTENSION_API__V1_ENDPOINT" >> .env \
  && echo "NEXT_PUBLIC_VOICE_API__V1_ENDPOINT=$NEXT_PUBLIC_VOICE_API__V1_ENDPOINT" >> .env \
  && echo "NEXT_PUBLIC_PAYMENT_API__V1_ENDPOINT=$NEXT_PUBLIC_PAYMENT_API__V1_ENDPOINT" >> .env \
  && echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" >> .env \
  && echo "NEXT_PUBLIC_SCHEDULER_API__V1_ENDPOINT=$NEXT_PUBLIC_SCHEDULER_API__V1_ENDPOINT" >> .env

# Set NEXT_TELEMETRY_DISABLED to 1 to disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone output
# The standalone output is in .next/standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# The standalone output includes a server.js file to run the app
CMD ["node", "server.js"]
