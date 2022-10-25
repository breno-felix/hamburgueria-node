const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const server = express();
const port = process.env.PORT || 3001;

server.use(express.json());
server.use(cors());

const orders = [];

const checkUserId = (req, res, next) => {
  const { id } = req.params;

  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  req.userId = id;
  req.userIndex = index;

  next();
};

const printMethodAndUrl = (req, res, next) => {
  console.log(`[${req.method}] - ${req.url}`);
  next();
};

server.get("/orders", printMethodAndUrl, (req, res) => {
  return res.json(orders);
});

server.post("/orders", printMethodAndUrl, (req, res) => {
  try {
    const { clienteOrder, clienteName, price } = req.body;

    const order = {
      id: uuid.v4(),
      clienteOrder,
      clienteName,
      price,
      status: "Em preparação",
    };

    orders.push(order);

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

server.put("/orders/:id", checkUserId, printMethodAndUrl, (req, res) => {
  const { clienteOrder, clienteName, price } = req.body;
  const index = req.userIndex;

  const updateOrder = {
    id: req.userId,
    clienteOrder,
    clienteName,
    price,
    status: "Em preparação",
  };

  orders[index] = updateOrder;

  return res.json(updateOrder);
});

server.delete("/orders/:id", checkUserId, printMethodAndUrl, (req, res) => {
  orders.splice(req.userIndex, 1);

  return res.status(204).json();
});

server.get("/orders/:id", checkUserId, printMethodAndUrl, (req, res) => {
  return res.json(orders[req.userIndex]);
});

server.patch("/orders/:id", checkUserId, printMethodAndUrl, (req, res) => {
  orders[req.userIndex].status = "Pronto";

  return res.json(orders[req.userIndex]);
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
