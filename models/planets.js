const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const planetsSchema = new Schema({
  _id: { type: Schema.ObjectId, required: true },
  name: { type: String, required: true },
  orderFromSun: { type: Number, required: true },
  hasRings: { type: Boolean, required: true },
  mainAtmosphere: { type: Array, required: true },
  surfaceTemperatureC: { type: Object, required: true },
});

//Export model
module.exports = mongoose.model('planets', planetsSchema);
