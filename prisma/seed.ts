// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

// Base categories
const baseCategories = [
  'Beverages',
  'Snacks',
  'Dairy',
  'Bakery',
  'Canned Goods',
  'Condiments',
  'Frozen Foods',
  'Grains & Pasta',
  'Meat & Poultry',
  'Produce'
]

async function main() {
  console.log('Start seeding categories...')
  
  // Create categories with error handling
  for (const categoryName of baseCategories) {
    try {
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
        }
      })
      
      console.log(`Created/Updated category: ${category.name} (${category.id})`)
    } catch (error) {
      console.error(`Error creating category ${categoryName}:`, error)
    }
  }

  // Optional: Create additional random categories
  const numberOfRandomCategories = 5
  for (let i = 0; i < numberOfRandomCategories; i++) {
    try {
      const randomCategoryName = `${faker.commerce.department()} ${faker.number.int({ min: 1, max: 100 })}`
      
      const category = await prisma.category.create({
        data: {
          name: randomCategoryName,
        }
      })
      
      console.log(`Created random category: ${category.name} (${category.id})`)
    } catch (error) {
      console.error('Error creating random category:', error)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
