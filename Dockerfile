# We can't use alpine because I couldn't pinpoint libgit2 dependencies.
FROM node:13.1.0

# Typescript is in dev packages.
# If we enable this, dev packages won't be downloaded
# but we need to change build script such that typescript
# is already compiled. For now ignoring
#ARG NODE_ENV=development
#ENV NODE_ENV=${NODE_ENV}

# Set the working directory to /app
WORKDIR /app

# Copy package.json into the container at /app
RUN mkdir -p /app/frontend
COPY package*.json /app/
COPY ./frontend/package*.json /app/frontend/

# Install dependencies
# RUN BUILD_ONLY=true npm install nodegit && npm install --silent
RUN npm install --silent
RUN cd frontend && npm install --silent

# Copy the current directory contents into the container at /app
COPY . /app/
