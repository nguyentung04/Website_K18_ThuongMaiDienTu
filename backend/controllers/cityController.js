const connection = require("../config/database");

exports.getCities = (req, res) => {
  connection.query("SELECT * FROM cities", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getDistrictsByCity = (req, res) => {
  const { cityId } = req.params;
  connection.query("SELECT * FROM districts WHERE city_id = ?", [cityId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};