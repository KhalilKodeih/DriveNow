const router = require("express").Router();
const controller = require("../controllers/car.controller");

// CRUD routes
router.get("/", controller.getAllCars);         // Get all cars
router.get("/:id", controller.getCarById);     // Get single car
router.post("/", controller.createCar);        // Add new car
router.put("/:id", controller.updateCar);      // Update car
router.delete("/:id", controller.deleteCar);   // Delete car

module.exports = router;
