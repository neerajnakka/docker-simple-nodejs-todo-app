FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

# Use `npm ci` for faster, reproducible installs
RUN npm ci --only=production

# Thanks to .dockerignore, this WON'T copy local node_modules
COPY . .

EXPOSE 3000

# Use "start" for production, not "dev"
CMD ["npm", "start"]