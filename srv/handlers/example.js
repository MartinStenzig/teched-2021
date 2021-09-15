const cds = require('@sap/cds');
const fx = require('./supportfunctions')
var wkx = require('wkx');

class ExampleService extends cds.ApplicationService {

  init() {

    // Create new instance of support functions
    this.sfx = new fx()

    // Definition of database type
    const DB_KIND_HANA = 'hana';

    // *************************
    // Read AFTER - handler
    // *************************
    this.after('READ', 'RealtimeLocations', async (req) => {

      // Get refence to the database
      const db = await cds.connect.to("db")

      // Revert to original processing if database is not HANA
      if (db.kind == DB_KIND_HANA) {

        // Loop over all result records
        for (let z = 0; z < req.length; z++) {

          // determine if geometry is defined
          if (req[z].rtGeometry != undefined) {

            // Parse the geometry from wkb 
            let geometry = wkx.Geometry.parse(req[z].rtGeometry)

            // generate the geoJSON 
            let geoJSON = geometry.toGeoJSON();

            // overwrite the current req
            req[z].rtGeometry = JSON.stringify(geoJSON)
          }
          else {
            // output warning level 
            console.warn('rtGeometry is undefined')
          }
        }
      }
      // Return request container 
      return req;
    })

    // *************************
    // Create BEFORE - handler
    // *************************
    this.before('CREATE', 'RealtimeLocations', (req) => {

      // If no ID was defined generatte one and assign to request container
      if (req.data.ID == undefined) {
        req.data.ID = this.sfx.uuidv4();
      }

      // Determine current timetamp
      let currentTimestamp = (new Date()).toJSON();

      // Preset the request with default information
      req.data.createdAt = currentTimestamp;
      req.data.createdBy = req.user.id;
      req.data.modifiedAt = currentTimestamp;
      req.data.modifiedBy = req.user.id;

      // Return the request container 
      return req
    })

    // *************************
    // Create ON  - handler
    // *************************
    this.on('CREATE', 'RealtimeLocations', async (req, next) => {

      // Get refence to the database
      const db = await cds.connect.to("db");

      // Revert to original processing if database is not HANA
      if (db.kind == DB_KIND_HANA) {
        console.log('DB is HANA...')

        // Determine SQL INSERT statement
        let myInsertSQL = this.sfx.createInsertStatement(req.query, req.target);

        // Create Transaction
        let tx = cds.tx(req);

        // Execute the insert statement
        let myResult = await tx.run(myInsertSQL);

        console.log('DB Insert result', myResult)

        return req.data;
      }
      else {
        console.log('DB is SQL Lite...')
        return next();
      }
    })

    // Add base class's handlers. Handlers registered above go first.
    return super.init()
  }


}
module.exports = { ExampleService }