const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const { 
  getCars, 
  createCar, 
  showCreateForm, 
  showEditForm, 
  updateCar,
  deleteCar
} = require("../controllers/carController");

// public listing
router.get("/", getCars);

// everything below requires authentication
router.get("/new", auth, showCreateForm);
router.post("/create", auth, createCar);
router.get("/:id/edit", auth, showEditForm);
router.post("/:id/update", auth, updateCar);
router.post("/:id/delete", auth, deleteCar);

module.exports = router;
