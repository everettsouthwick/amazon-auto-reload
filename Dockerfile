FROM selenium/node-chrome-debug

###############################################################
# See the #docker section of the README.md for more information
###############################################################

# Needed for specific apt-get install package(s)
USER root

# selenium/node-* and raspbian/stretch images do not contain
#       npm
# (Verified 2019-05-01)
RUN apt-get update \
        && apt-get install -y \
                npm

ENV APPDIR finance-transact

# Cleanup from package installation
RUN rm -rf /var/lib/apt/lists/*

WORKDIR $APPDIR

COPY package.json ./

# Install node dependencies
# (will be cached unless package file is modified)
RUN npm install --production

COPY src ./src/
COPY tsconfig.json ./
COPY config/default.json5 ./config/

# Compile our TypeScript source code files
RUN npm run tsc

ENV VNC_NO_PASSWORD=1
