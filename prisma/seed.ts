// prisma/seed.ts
import { PrismaClient, User, Customer, Product, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'

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

// Product tags
const productTags = ['New', 'Featured', 'Best Seller', 'Sale', 'Organic']

// Admin user configuration
const adminUser = {
  email: 'admin@example.com',
  password: 'Admin@123', // You should change this in production
  role: 'ADMIN' as const
}

async function main() {
  console.log('Start seeding...')

  // Create admin user
  try {
    const hashedPassword = await hash(adminUser.password, 10)
    
    const admin = await prisma.user.upsert({
      where: { email: adminUser.email },
      update: {},
      create: {
        email: adminUser.email,
        name: 'Admin User',
        password: hashedPassword,
        role: adminUser.role,
      }
    })
    
    console.log(`Created/Updated admin user: ${admin.email}`)

    // Create additional users
    for (let i = 0; i < 3; i++) {
      const userEmail = faker.internet.email()
      await prisma.user.create({
        data: {
          email: userEmail,
          name: faker.person.fullName(),
          password: hashedPassword,
          role: faker.helpers.arrayElement(['MANAGER', 'USER']),
        }
      })
    }
  } catch (error) {
    console.error('Error creating users:', error)
  }

  // Create product tags
  const createdTags = []
  for (const tagName of productTags) {
    try {
      const tag = await prisma.productTag.create({
        data: {
          id: faker.string.uuid(),
          name: tagName
        }
      })
      createdTags.push(tag)
      console.log(`Created tag: ${tag.name}`)
    } catch (error) {
      console.error(`Error creating tag ${tagName}:`, error)
    }
  }

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
      
      // Create products for each category
      const numberOfProducts = faker.number.int({ min: 3, max: 8 })
      for (let i = 0; i < numberOfProducts; i++) {
        const productName = faker.commerce.productName()
        const randomTag = faker.helpers.arrayElement(createdTags)
        
        await prisma.product.create({
          data: {
            name: productName,
            description: faker.commerce.productDescription(),
            categoryId: category.id,
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 0, max: 100 }),
            sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
            image: faker.image.url(),
            status: faker.helpers.arrayElement(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']),
            featured: faker.datatype.boolean(),
            weight: faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 }),
            dimensions: {
              length: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
              width: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
              height: faker.number.float({ min: 1, max: 100, fractionDigits: 2 })
            },
            tags: {
              connect: [{ id: randomTag.id }]
            }
          }
        })
      }
      
      console.log(`Created/Updated category: ${category.name} with ${numberOfProducts} products`)
    } catch (error) {
      console.error(`Error creating category ${categoryName}:`, error)
    }
  }

  // Create customers with addresses and quotations
  const numberOfCustomers = 10
  for (let i = 0; i < numberOfCustomers; i++) {
    try {
      const customer = await prisma.customer.create({
        data: {
          name: faker.person.fullName(),
          company: faker.company.name(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          taxId: faker.string.numeric(9),
          notes: faker.lorem.sentence(),
          isActive: true,
          address: {
            create: {
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              postalCode: faker.location.zipCode(),
              country: faker.location.country(),
              isDefault: true
            }
          }
        }
      })
      console.log(`Created customer: ${customer.name}`)

      // Create quotations for each customer
      const numberOfQuotations = faker.number.int({ min: 1, max: 3 })
      const products = await prisma.product.findMany()
      const users = await prisma.user.findMany()

      for (let j = 0; j < numberOfQuotations; j++) {
        const numberOfItems = faker.number.int({ min: 1, max: 5 })
        let subtotal = 0
        const quotationItems = []

        // Create quotation items
        for (let k = 0; k < numberOfItems; k++) {
          const product = faker.helpers.arrayElement(products)
          const quantity = faker.number.int({ min: 1, max: 10 })
          const unitPrice = product.price
          const discount = faker.number.float({ min: 0, max: 10, fractionDigits: 2 })
          const tax = faker.number.float({ min: 0, max: 5, fractionDigits: 2 })
          const total = (quantity * unitPrice * (1 - discount / 100)) * (1 + tax / 100)

          quotationItems.push({
            productId: product.id,
            quantity,
            unitPrice,
            discount,
            tax,
            total,
            notes: faker.commerce.productDescription()
          })

          subtotal += total
        }

        const taxRate = faker.number.float({ min: 0, max: 10, fractionDigits: 2 })
        const taxAmount = subtotal * (taxRate / 100)
        const discount = faker.number.float({ min: 0, max: 15, fractionDigits: 2 })
        const shippingCost = faker.number.float({ min: 0, max: 50, fractionDigits: 2 })
        const totalAmount = subtotal + taxAmount - discount + shippingCost

        // Create quotation
        const quotation = await prisma.quotation.create({
          data: {
            quotationNumber: `QT-${faker.string.numeric(6)}`,
            customerId: customer.id,
            userId: faker.helpers.arrayElement(users).id,
            date: faker.date.recent(),
            validUntil: faker.date.future(),
            status: faker.helpers.arrayElement(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED']),
            subtotal,
            taxRate,
            taxAmount,
            discount,
            discountType: faker.helpers.arrayElement(['PERCENTAGE', 'FIXED']),
            shippingCost,
            totalAmount,
            notes: faker.lorem.paragraph(),
            terms: faker.lorem.paragraphs(2),
            paymentTerms: faker.helpers.arrayElement(['IMMEDIATE', 'NET_15', 'NET_30', 'NET_45', 'NET_60']),
            currency: 'USD',
            items: {
              create: quotationItems
            },
            activities: {
              create: {
                userId: faker.helpers.arrayElement(users).id,
                type: 'CREATED',
                description: 'Quotation created'
              }
            },
            attachments: {
              create: {
                filename: `quotation_${faker.string.alphanumeric(8)}.pdf`,
                fileUrl: faker.internet.url(),
                fileType: 'application/pdf',
                fileSize: faker.number.int({ min: 100000, max: 5000000 })
              }
            }
          }
        })

        console.log(`Created quotation: ${quotation.quotationNumber}`)
      }
    } catch (error) {
      console.error('Error creating customer and quotations:', error)
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
