import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function runDBSeed () {
  const user1Email = 'laura@example.com'
  const user1 = await prisma.user.upsert({
    where: { email: user1Email },
    update: {},
    create: {
      name: 'Laura',
      email: user1Email,
      posts: {
        create: [
          {
            title: 'GraphQL Academy #1 - Definition',
            isPublished: true,
            comments: {
              create: [
                {
                  author: { connect: { email: user1Email } },
                  text: 'Awesome post created by me!'
                },
                {
                  author: { connect: { email: user1Email } },
                  text: 'Well... it could be better'
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log(`DB Seed 🌱 - User ${user1.email} created along with posts and comments`)

  const user2Email = 'junior@example.com'
  const user2 = await prisma.user.upsert({
    where: { email: user2Email },
    update: {},
    create: {
      name: 'Junior',
      email: user2Email,
      posts: {
        create: [
          {
            title: 'GraphQL Academy #2 - Operations',
            isPublished: false
          },
          {
            title: 'GraphQL Academy #3 - Schema Design',
            isPublished: false,
            comments: {
              create: [
                {
                  author: { connect: { email: user2Email } },
                  text: 'Awesome post created by me!'
                },
                {
                  author: { connect: { email: user1.email } },
                  text: 'Well... mine is better than yours'
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log(`DB Seed 🌱 - User ${user2.email} created with posts and comments`)

  const user3Email = 'adriana@example.com'
  const user3 = await prisma.user.upsert({
    where: { email: user3Email },
    update: {},
    create: {
      name: 'Junior',
      email: user2Email,
      posts: {
        create: [
          {
            title: 'GraphQL Academy #4 - Directives',
            isPublished: true
          },
          {
            title: 'GraphQL Academy #5 - Servers',
            isPublished: false,
            comments: {
              create: [
                {
                  author: { connect: { email: user3Email } },
                  text: 'Awesome post created by me!'
                },
                {
                  author: { connect: { email: user2.email } },
                  text: 'Well... mine is better than yours'
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log(`DB Seed 🌱 - User ${user3.email} created with posts and comments`)
}

runDBSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('DB Seed 🌱 - Finished!')

    await prisma.$disconnect()
  })
