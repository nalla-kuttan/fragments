#This file is used to define all of the Docker instructions necessary for Docker Engine to build an image of the fragments service

 # Stage 0: install the base dependencies

 # FROM instruction specifies the parent (or base) image to use as a starting point for our own image

 FROM node:18.14.2-alpine@sha256:0d2712ac2b2c1149391173de670406f6e3dbdb1b2ba44e8530647e623e0e1b17 AS dependencies

 #
 LABEL maintainer="Ruban Manoj <ruban-manoj-paul@myseneca.ca>"
 LABEL description="Fragments node.js microservice"

 # Environment variables

 # We default to use port 8080 in our service
 ENV PORT=8080
 ENV NPM_CONFIG_LOGLEVEL=warn
 # https://docs.npmjs.com/cli/v8/using-npm/config#color
 ENV NPM_CONFIG_COLOR=false

 # define and create our app's working directory
 # Use /app as our working directory
 WORKDIR /app

 COPY package*.json ./
 # Install node dependencies defined in package-lock.json
 RUN npm install

 ##########################################################################################
 # Stage 1: start the service

 FROM node:18.14.2-alpine@sha256:0d2712ac2b2c1149391173de670406f6e3dbdb1b2ba44e8530647e623e0e1b17 AS build

 WORKDIR /app
 # Copy the generated dependencies(node_modules/)
 COPY --chown=node:node --from=dependencies /app /app
 # Copy your server's source code into the image
 # Copy src to /app/src/
 COPY --chown=node:node ./src ./src

 # Copy our HTPASSWD file
 COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

 # Switch user to node before we run the app
 USER node

 # ENTRYPOINT ["/sbin/dumb-init", "--"]

 # Start the container by running our server
 CMD ["node", "src/index.js"]

 # We run our service on port 8080
 EXPOSE 8080

 HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
   CMD curl --fail localhost:8080 || exit 1