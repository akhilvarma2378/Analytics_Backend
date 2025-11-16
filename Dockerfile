FROM node:18-alpine

WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install ALL dependencies (including dev, to support Prisma Generate)
RUN npm install

# Copy the rest of the app code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
