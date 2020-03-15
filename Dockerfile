
# Build production code
FROM node:12-alpine3.9 AS builder

COPY . /application/

RUN ( cd /application && ./needed_tools.sh )
RUN ( cd /application && ./npm_install.sh ) 

RUN ( cd /application && ./build_prod.sh )


# Effective Docker image
FROM node:12-alpine3.9

COPY --from=builder /application/server /application
WORKDIR /application

EXPOSE 3000
CMD [ "node", "dist/main.js" ]
