using {riz.inno.teched2021 as my} from '../db/core';

service ExampleService @(path : '/nssexample')
{
  entity RealtimeLocations as projection on my.RealtimeLocations;
}