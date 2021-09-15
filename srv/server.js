const cds = require('@sap/cds')
const GeoJSON = require('geojson');
var wkx = require('wkx');

const CDS_SERVICE_NAME = 'ExampleService';
const DB_KIND_HANA = 'hana';

console.log("[RIZ] - customer specific endpoint for '/geojson'");

// *************************
// Bootstrapping method
// *************************
cds.on('bootstrap', (app) => {

    app.get('/geojson/', async function (req, res) {
        // Output trigger information to console
        console.log('geo json request.');

        // Initialize return structure
        let geoJsonResponse = [];

        // Establish connection to CDS Service
        const serviceNssExample = await cds.connect.to(CDS_SERVICE_NAME);

        // Establish connection to DB to determnine db.kind
        const db = await cds.connect.to("db")

        // Retrieve entity meta data from service
        const { RealtimeLocations } = serviceNssExample.entities('riz.inno.teched2021');

        // execute select onto service
        let serviceResponse = await serviceNssExample.run(SELECT.from(RealtimeLocations));

        // Loop over all result records
        for (let z = 0; z < serviceResponse.length; z++) {

            // Prepartation of geometry field based on database
            if (db.kind == DB_KIND_HANA) {
                serviceResponse[z].rtGeometry = (wkx.Geometry.parse(serviceResponse[z].rtGeometry)).toGeoJSON()
            }
            else {
                serviceResponse[z].rtGeometry = JSON.parse(serviceResponse[z].rtGeometry)
            }

        }

        // generate GeoJSON
        geoJsonResponse = GeoJSON.parse(serviceResponse, { GeoJSON: 'rtGeometry' });

        res.json(geoJsonResponse);
        res.end();

    });
});



// ... some custom bootstrapping ...
module.exports = cds.server //> delegate to default server.js