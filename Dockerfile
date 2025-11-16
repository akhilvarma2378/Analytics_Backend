FROM node:18-alpine

WORKDIR /app

# Copy everything first (including prisma schema)
COPY . .

# Install all dependencies (this now sees prisma folder)
RUN npm install

# Generate Prisma client (optional, postinstall will do this)
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]
