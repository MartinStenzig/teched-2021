const cds = require("@sap/cds");
const GeoJSON = require('geojson');
var wkx = require('wkx');

module.exports = cds.service.impl(async function () {
  const DB_KIND_HANA = 'hana';

  const { RealtimeLocations } = this.entities;
  const service = await cds.connect.to("ExampleService");

  // Establish connection to DB to determnine db.kind
  const db = await cds.connect.to("db")

  this.on("READ", RealtimeLocations, async (req) => {

    // Query service
    let serviceResults = await service.tx(req).run(req.query);

    // Loop over all result records
    for (let z = 0; z < serviceResults.length; z++) {

      // Prepartation of geometry field based on database
      if (db.kind == DB_KIND_HANA) {
        serviceResults[z].rtGeometry = (wkx.Geometry.parse(serviceResults[z].rtGeometry)).toGeoJSON()
      }
      else {
        serviceResults[z].rtGeometry = JSON.parse(serviceResults[z].rtGeometry)
      }

    }

    let geoJsonResponse = GeoJSON.parse(serviceResults, { GeoJSON: 'rtGeometry' });
    return geoJsonResponse;
  });

});