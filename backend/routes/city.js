const express = require("express");
const router = express.Router();
const locationController = require("../controllers/cityController");

router.get("/cities", locationController.getCities);
router.get("/districts/:cityId", locationController.getDistrictsByCity);

module.exports = router;