const express = require("express");
const router = require("./auth");
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
    });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { title, description, productIds } = req.body;
  if (!title || !description || !productIds || !Array.isArray(productIds)) {
    return res.status(400).json({ error: "Missing required fields or invalid productIds array" });
  }
  try {
    const products = productIds.map((id) => ({ id }));
    const order = await prisma.order.create({
      data: {
        title,
        description,
        customerId: req.user.id,
        products: { connect: products },
      },
      include: {
        customer: true,
        products: true,
      },
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: +id },
      include: { products: true },
    });
    if (order.customerId !== req.user.id) {
      next({ status: 403, message: "You do not own this order"});
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
});

module.exports = router;