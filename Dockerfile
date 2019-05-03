FROM selenium/node-chrome-debug

# Works for now to test the build process on a fresh image.
# Ideally the app would also run in the container, but I haven't yet been able to get
# the desktop  browsers to instantiate without erroring out.

ENV APPDIR make-purchases

# Needed for specific apt-get install package(s)
USER root

# selenium/node-* image does not contain
#       npm
# (Verified 2019-05-01)
RUN apt-get update \
        && apt-get install -y \
                npm

# Cleanup from apt-get
RUN rm -rf /var/lib/apt/lists/*

WORKDIR $APPDIR

COPY package*.json ./

# Install node dependencies
# (will be cached unless package file is modified)
RUN npm install --production

COPY src ./src/
COPY tsconfig.json ./
COPY config/default.json ./config/

# Compile our TypeScript source code files
RUN npm run tsc

CMD ["npm", "start"]
