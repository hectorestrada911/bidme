import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create a test request
  await prisma.request.create({
    data: {
      title: 'Web Design Project',
      description: 'Looking for a modern, responsive website design for a small business',
      quantity: 1,
      budget: 1500,
      deadline: new Date(new Date().setDate(new Date().getDate() + 30)),
      category: 'Professional Work',
      status: 'OPEN'
    }
  })

  console.log('Seeded database with test request')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
