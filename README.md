<img src="https://i.giphy.com/media/S3Pe5NZqgmE8Tl3NI5/giphy-downsized-large.gif" width="150"/>

# GraphQL Academy

Simple GraphQL API to be used as a guidance from the topics covered on my workshop called "GraphQL Academy"

## Technologies 
The goal of this workshop is not to suggest/advocate for specific GraphQL libraries, thus don't feel obliged of choosing
the same dependencies from this repo as the choices for your project 

However, you can find the reasoning behind my choices [in this pull request](https://github.com/LauraBeatris/graphql-academy/pull/1)

## References by topic
Not every topic from the workshop will be referenced here, but I'll try as much as possible
to link implementations so that you can use as a basis for your personal project / challenges proposed on each class 

- [Initial GraphQL API setup with Apollo Server](https://github.com/LauraBeatris/graphql-academy/pull/1)
- [Schema implementation using TypeGraphQL (Annotation-based implementation)](https://github.com/LauraBeatris/graphql-academy/tree/main/src/graphql/schema)
- [Resolvers + data layer with Prisma](https://github.com/LauraBeatris/graphql-academy/pull/3)
- [Reproducing N+1 issue](https://github.com/LauraBeatris/graphql-academy/pull/4)
- [Mutations with payload, input types and error as data handling](https://github.com/LauraBeatris/graphql-academy/pull/6)
- [Pagination: Cursor & Offset styles](https://github.com/LauraBeatris/graphql-academy/pull/7)

## Steps to run API locally

### Install dependencies
```bash
yarn install
```

### Configure & migrate database
Make sure to have a Postgres database running in order to execute the migration script.
Create a .env file based on .env.example and update the variables according to your database configuration.

```bash
cp .env.example .env
```
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/graphql-basis?schema=public"
```

Run the `migrate-dev` script, which will migrate tables defined on [Prisma schema](./prisma/schema.prisma) and execute a [seed script](./prisma/seed.ts)
to populate some initial data in order to use the API locally
```bash
yarn migrate-dev
```
`
### Start the GraphQL server 

```
yarn dev
```
