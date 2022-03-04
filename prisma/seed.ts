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
      name: 'Adriana',
      email: user3Email,
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
          },
          {
            title: 'GraphQL Academy #6 - Performance',
            isPublished: true,
            comments: {
              create: [
                {
                  author: { connect: { email: user1.email } },
                  text: 'Awesome post!'
                },
                {
                  author: { connect: { email: user1.email } },
                  text: 'Could you tell me more about edge cases?'
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log(`DB Seed 🌱 - User ${user3.email} created with posts and comments`)

  const user4Email = 'luis@example.com'
  const user4 = await prisma.user.upsert({
    where: { email: user4Email },
    update: {},
    create: {
      name: 'Luis',
      email: user4Email,
      posts: {
        create: [
          {
            title: 'GraphQL Academy #7 - N+1 issue',
            isPublished: false,
            comments: {
              create: [
                {
                  author: { connect: { email: user4Email } },
                  text: 'Awesome post created by me!'
                },
                {
                  author: { connect: { email: user3.email } },
                  text: 'Well... mine is better than yours'
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log(`DB Seed 🌱 - User ${user4.email} created with posts and comments`)

  const brandName = 'AMAZING BRAND!'
  const brand = await prisma.brand.upsert({
    where: { name: brandName },
    update: {},
    create: {
      name: brandName,
      posts: {
        create: [{
          title: 'Review of an amazing brand!',
          author: { connect: { email: user4.email } }
        }]
      }
    }
  })
  console.log(`DB Seed 🌱 - Brand ${brand.name} created with post`)
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
