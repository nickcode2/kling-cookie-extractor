FROM node:18-slim

# Install Chromium
RUN apt-get update && apt-get install -y chromium

# Set Puppeteer Chromium path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set working dir
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Run the app
CMD ["node", "index.js"]
