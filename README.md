## Description

## Installation

```bash
$ npm install -g dotenv-cli
```

Also, install **protoc**

```bash
$ pnpm install
```

## Running the app

```bash
# watch mode
$ pnpm run start:dev
```

## Test

```bash
# e2e tests
$ pnpm run test:e2e
```

## Steps to start the app

Synchronize with remote repository

```bash
git pull origin master
```

Pull proto files and other submodules

```bash
git submodule update --recursive --remote --merge
```

Or, just configure alias. `git config --global alias.supdate "submodule update --recursive --remote --merge"`.

Then use
```bash
git supdate
```

Install all the dependencies

```bash
pnpm install
```

Change `prisma/schema.prisma` file to create a schema. After that, you can run

```bash
npx prisma migrate dev
```
to create the `initial migration`.

To generate prisma-client with all types included, run:
```bash
npx prisma generate
```
Generated files will be in `prisma/generated` folder


To generate protogen folder with typescript types, you need to change `protogen.sh` file. 
Change paths to proto files. `./protos/common/*.proto` should always be there. Then run

```bash
pnpm protogen
```

Now protogen, prisma migrations and types are generated. So, we can use the template as application.


If you want to use RabbitMQ to send or emit messages, you need to use ClientModule inside the modules, where it is necessary.
If you do not need that, just delete the ClientModule.

After that, write e2e tests and run them using pnpm test:e2e.

# Testing

Run mongodb locally if not already started:
```bash
pnpm mongo:start
```

Run tests via:
```bash
pnpm test:e2e
```

All tests are configured via `jest-e2e.json` and `setup-jest.ts`

For that to work, you need to have MongoDB and RabbitMQ running on your local machine.

If you want to test by using docker, just run:

```bash
 docker build -t app . -f ./Dockerfile.test
 docker-compose -f ./docker-compose.test.yaml run app
```



