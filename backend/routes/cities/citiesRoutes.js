const express = require("express");
const router = express.Router();

const citiesController = require("../../controllers/citiesController");

router.get("/cities", citiesController.getAllCities);
router.get("/cities/:id", citiesController.getCitiesById);
router.delete("/cities/:id", citiesController.deleteCities);
router.post("/cities", citiesController.postCities);
router.put("/cities/:id", citiesController.updateCities);

module.exports = router;
