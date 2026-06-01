FROM node:18-alpine

WORKDIR /app

# Install git and other dependencies
RUN apk add --no-cache git bash python3 make g++ http-server

COPY package*.json ./
RUN npm install --production

COPY . .

# Create necessary directories
RUN mkdir -p projects deployments uploads

EXPOSE 5000

CMD ["npm", "start"]
