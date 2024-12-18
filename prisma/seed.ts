// prisma/seed.ts
import {
  PrismaClient,
  Role,
  ProductStatus,
  QuotationStatus,
  PaymentTerms,
  Product,
} from "@prisma/client";
import { hash } from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const TOTAL_USERS = 10;
const TOTAL_CATEGORIES = 5;
const TOTAL_PRODUCTS = 20;
const TOTAL_TAGS = 8;
const TOTAL_QUOTATIONS = 50;
const MAX_ITEMS_PER_QUOTATION = 5;

const ACTIVITY_TYPES = [
  "CREATED",
  "UPDATED",
  "STATUS_CHANGED",
  "COMMENT_ADDED",
  "ATTACHMENT_ADDED",
  "SENT",
];

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports Equipment",
  "Office Supplies",
  "Home & Garden",
  "Automotive",
  "Tools",
  "Software",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.$transaction([
    prisma.activity.deleteMany(),
    prisma.attachment.deleteMany(),
    prisma.quotationItem.deleteMany(),
    prisma.quotation.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productTag.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create admin user
  console.log("👤 Creating admin user...");
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
      image: faker.image.avatar(),
      isActive: true,
    },
  });

  // Create regular users
  console.log("👥 Creating regular users...");
  const users = await Promise.all(
    Array(TOTAL_USERS)
      .fill(null)
      .map(async () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return prisma.user.create({
          data: {
            email: faker.internet.email({ firstName, lastName }),
            name: `${firstName} ${lastName}`,
            password: await hash("password123", 12),
            role: faker.helpers.arrayElement([Role.USER, Role.MANAGER]),
            emailVerified: faker.helpers.maybe(() => faker.date.past()),
            image: faker.helpers.maybe(() => faker.image.avatar()),
            isActive: true,
          },
        });
      })
  );

  // Create categories
  console.log("📁 Creating categories...");
  const categories = await Promise.all(
    CATEGORIES.slice(0, TOTAL_CATEGORIES).map((categoryName) => {
      return prisma.category.create({
        data: {
          name: categoryName,
        },
      });
    })
  );

  // Create products
  console.log("📦 Creating products...");
  const products = await Promise.all(
    Array(TOTAL_PRODUCTS)
      .fill(null)
      .map((_, index) => {
        return prisma.product.create({
          data: {
            name: `${faker.commerce.productName()}-${index + 1}`, // Ensure unique names
            description: faker.commerce.productDescription(),
            categoryId: faker.helpers.arrayElement(categories).id,
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 0, max: 100 }),
            sku: `SKU-${String(index + 1).padStart(3, "0")}`,
            image: faker.helpers.maybe(() => faker.image.url()),
            status: faker.helpers.arrayElement(Object.values(ProductStatus)),
            featured: faker.datatype.boolean(),
            weight: faker.helpers.maybe(() =>
              faker.number.float({ min: 0.1, max: 20 })
            ),
            dimensions: faker.helpers.maybe(() => ({
              length: faker.number.float({ min: 1, max: 100 }),
              width: faker.number.float({ min: 1, max: 100 }),
              height: faker.number.float({ min: 1, max: 100 }),
            })),
          },
        });
      })
  );

  // Create quotations
  console.log("📄 Creating quotations...");
  for (let i = 0; i < TOTAL_QUOTATIONS; i++) {
    const user = faker.helpers.arrayElement(users);
    const date = faker.date.past({ years: 1 });
    const validUntil = faker.date.future({ years: 1, refDate: date });

    try {
      // First create the quotation
      const quotation = await prisma.quotation.create({
        data: {
          quotationNumber: `Q-${date.getFullYear()}-${String(i + 1).padStart(
            3,
            "0"
          )}`,
          userId: user.id,
          date,
          validUntil,
          status: faker.helpers.arrayElement(Object.values(QuotationStatus)),
          subtotal: 0,
          taxRate: faker.number.float({ min: 0, max: 0.2 }),
          taxAmount: 0,
          discount: faker.number.float({ min: 0, max: 100 }),
          discountType: faker.helpers.arrayElement(["PERCENTAGE", "FIXED"]),
          shippingCost: faker.number.float({ min: 0, max: 50 }),
          totalAmount: 0,
          notes: faker.helpers.maybe(() => faker.lorem.paragraph()),
          terms: faker.helpers.maybe(() => faker.lorem.paragraphs(2)),
          paymentTerms: faker.helpers.arrayElement(Object.values(PaymentTerms)),
          currency: faker.helpers.arrayElement(["USD", "EUR", "GBP"]),
          revisionNumber: faker.number.int({ min: 0, max: 5 }),
        },
      });

      // Create items
      const itemsCount = faker.number.int({
        min: 1,
        max: MAX_ITEMS_PER_QUOTATION,
      });
      let subtotal = 0;

      for (let j = 0; j < itemsCount; j++) {
        const selectedProduct = faker.helpers.arrayElement(products);
        const quantity = faker.number.int({ min: 1, max: 10 });
        const unitPrice = selectedProduct.price;
        const discount = faker.number.float({ min: 0, max: 20 });
        const tax = faker.number.float({ min: 0, max: 0.2 });
        const total = quantity * unitPrice * (1 - discount / 100) * (1 + tax);

        await prisma.quotationItem.create({
          data: {
            quotationId: quotation.id,
            productId: selectedProduct.id,
            quantity,
            unitPrice,
            discount,
            tax,
            total,
            notes: faker.helpers.maybe(() => faker.lorem.sentence()),
          },
        });

        subtotal += total;
      }

      // Create activities
      await prisma.activity.create({
        data: {
          quotationId: quotation.id,
          userId: user.id,
          type: "CREATED",
          description: "Quotation created",
          createdAt: date,
        },
      });

      // Add random additional activities
      if (faker.datatype.boolean()) {
        const additionalActivities = Array(faker.number.int({ min: 1, max: 3 }))
          .fill(null)
          .map(() => ({
            quotationId: quotation.id,
            userId: faker.helpers.arrayElement([...users, admin]).id,
            type: faker.helpers.arrayElement(ACTIVITY_TYPES.slice(1)),
            description: faker.lorem.sentence(),
            createdAt: faker.date.between({ from: date, to: new Date() }),
          }));

        await prisma.activity.createMany({
          data: additionalActivities,
        });
      }

      // Create attachments
      if (faker.datatype.boolean()) {
        const attachments = Array(faker.number.int({ min: 1, max: 3 }))
          .fill(null)
          .map(() => ({
            quotationId: quotation.id,
            filename: `${faker.system.fileName()}.${faker.helpers.arrayElement([
              "pdf",
              "doc",
              "xlsx",
            ])}`,
            fileUrl: faker.internet.url(),
            fileType: faker.helpers.arrayElement([
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ]),
            fileSize: faker.number.int({ min: 1024, max: 10485760 }), // 1KB to 10MB
            uploadedAt: faker.date.between({ from: date, to: new Date() }),
          }));

        await prisma.attachment.createMany({
          data: attachments,
        });
      }

      // Update quotation with calculated totals
      const taxAmount = subtotal * quotation.taxRate;
      const totalAmount =
        subtotal + taxAmount - quotation.discount + quotation.shippingCost;

      await prisma.quotation.update({
        where: { id: quotation.id },
        data: {
          subtotal,
          taxAmount,
          totalAmount,
        },
      });
    } catch (error) {
      console.error(`Error creating quotation ${i + 1}:`, error);
      throw error;
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
