# Base image
FROM node:18-alpine as base

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .

# Setting ENV variable
ENV NODE_ENV production

# Install only production app dependencies with integrated cache mount to speed up installation
RUN --mount=type=cache,target=/usr/src/app/.npm \  
 npm set cache /usr/src/app/.npm && \
 npm i -g @nestjs/cli && \
 npm i

RUN chown -R node .

# Setting up user for security reasons
USER node

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
