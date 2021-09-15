
class SupportFunctions {

  /**
   * Constructor
   */
  constructor() {

    this.list_entity_type_StringTreatment = ['cds.UUID', 'cds.String', 'cds.Timestamp', 'cds.LargeString', 'cds.Association'];
    this.list_entity_type_GeometryTreatment = ['cds.hana.ST_GEOMETRY'];
    this.applicableTableName = "RIZ_INNO_TECHED2021_REALTIMELOCATIONS";

  }

  /**
   * 
   * @param {String} anEntityName 
   * @returns 
   */
  determineHANATableName(anEntityName) {
    return anEntityName.replace(/\./g, '_').toUpperCase();
  }

  /**
   * Assembles a SQL statement to insert geometry
   * @param {Object} aRequestQueryObject 
   * @param {Object} aRequestTargetObject 
   * @returns {String} The Insert SQL statement that is going to be used to insert the data into the database
   */
  createInsertStatement(aRequestQueryObject, aRequestTargetObject) {

    // Necessary variables
    let myFields = '';
    let myValues = '';

    // Reference to entities to be inserted
    let myObject = aRequestQueryObject.INSERT.entries[0];

    // retrieve existing keys in object !!! Supports only single record submits at the moment
    let myKeys = Object.keys(myObject)

    // Number of keys
    let numberOfKeys = myKeys.length;

    // Loop over all entities in the INSERT object 
    for (let z = 0; z < numberOfKeys; z++) {

      // Determine Field value
      let myValue = myObject[myKeys[z]];

      // If a value is set for the key, exeucte the following
      if (myValue != undefined && myValue != null) {

        // Attach commas in case of multiple values
        if ((z > 0) && (z < numberOfKeys)) {
          myFields += ', ';
          myValues += ', ';
        }

        // Add the key to the field list
        myFields += myKeys[z];

        // Determine the associate field defintion
        let myCurrentEntityDetails = aRequestTargetObject.elements[myKeys[z]];

        // If the field is a string value, escape the value
        if (this.list_entity_type_StringTreatment.includes(myCurrentEntityDetails.type)) {
          myValue = "'" + myValue + "'";
        }

        // If the field type is a geometry, wrap it in a geometry function
        if (this.list_entity_type_GeometryTreatment.includes(myCurrentEntityDetails.type)) {
          myValue = this.wrapGisDataField(myValue, myCurrentEntityDetails.srid);
        }

        // Add the value to the value list
        myValues += myValue;
      }
    }

    // Assemble the ultimate INSERT statement
    return `INSERT INTO ${this.applicableTableName} (${myFields}) VALUES (${myValues})`

  }

  /**
   * Wrappes a geometry value in a geometry function
   * @param {Object} aGeoJsonValue 
   * @param {int} aSrid 
   * @returns {String} The wrapped String
   */
  wrapGisDataField(aGeoJsonValue, aSrid) {

    return `ST_GeomFromGeoJSON('${aGeoJsonValue}', ${aSrid})`

  }

  /**
  * Returns a generated UUID V4
  * @returns {String} The generated UUID
  */
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
module.exports = SupportFunctions;