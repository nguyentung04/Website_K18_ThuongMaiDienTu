const express = require("express");
const router = express.Router();

const districtsController = require("../../controllers/districtsController");

router.get("/districts", districtsController.getAlldistricts);
router.get("/districts/:id", districtsController.getDistrictsById);
router.delete("/districts/:id", districtsController.deleteDistricts);
router.post("/districts", districtsController.postDistricts);
router.put("/districts/:id", districtsController.updateDistricts);

module.exports = router;
