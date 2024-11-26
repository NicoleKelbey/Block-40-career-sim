const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");


const seed = async (numProducts = 20) => {
const products = Array.from({ length: numProducts }, () => ({
        name: faker.products.productName(),
    }));
    await prisma.products.createMany({ data: products });
};
seed()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });