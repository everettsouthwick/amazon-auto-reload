FROM selenium/node-chrome-debug

# Works for now to test the build process on a fresh image.
# Ideally the app would also run in the container, but I haven't yet been able to get
# the desktop  browsers to instantiate without erroring out.

ENV APPDIR make-purchases

# selenium/node-* image does not contain
#       npm
# (Verified 2019-05-01)
USER root
RUN apt-get update \
        && apt-get install -y \
                npm

WORKDIR $APPDIR

COPY package*.json ./
COPY src ./src/
COPY tsconfig.json ./
COPY config.json ./

# Install node dependencies and compile our TypeScript
RUN npm install --production \
        && npm run build-ts

CMD ["npm", "start"]
