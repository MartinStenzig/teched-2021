namespace riz.inno.teched2021;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity RealtimeLocations : cuid, managed {
    rtDescription : String(1000);
    rtGeometry    : hana.ST_GEOMETRY(4326)@odata.Type : 'Edm.String'; // The Geometry itself
}
