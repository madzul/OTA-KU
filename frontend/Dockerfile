FROM node:20-alpine AS build
WORKDIR /app

# Define build arguments
ARG VITE_API_URL
ARG VITE_AZURE_CLIENT_ID

# Set these as environment variables for the build process
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AZURE_CLIENT_ID=${VITE_AZURE_CLIENT_ID}

# Install dependencies
RUN apk add --no-cache curl
COPY package.json .
RUN npm install --force

# Copy source code
COPY . .

# Build with environment variables
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install serve
RUN npm i -g serve
RUN apk add --no-cache curl

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start server
CMD ["serve", "-s", "dist"]