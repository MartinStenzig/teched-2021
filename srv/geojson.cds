using {ExampleService as base} from './example';

@protocol: 'rest'
service GeoJSON @(path : '/geojson'){
    
    @readonly
    entity RealtimeLocations as projection on base.RealtimeLocations{
          ID as ID,
          rtDescription as Description,
          rtGeometry as rtGeometry,
          status as Status, 
          objType as ObjectType,
          createdBy as createdBy,
          createdAt as createdAt,
          modifiedBy as modifiedBy,
          modifiedAt as modifiedAt
    }
}