# SAP TechEd 2021 - Network Spatial CAP Service Example  
The intent of this example is to show the use of a custom, CAP based, spatial data provider in the SAP Network Spatial Service (NSS) component.

<img src="./doc/images/ain-nss-screenshot.png" alt="AIN NSS Screenshot" height="411" width="640"/>

You will use the NSS configuration app to configure the additional service

## Configuration

# Development of a new CAP based source service 
## Step by Step
1. Create CAP project using `cds init` command
2. Add HANA and mta.yaml using `cds add hana` command
3. Adjusted the 'mta.yaml' file to make some changes I like
  - Adjusted the mta id
  - Changed the mta description
  - Added 2 parameters to the service
  ```yaml
    - memory: 200M
    - disk-quota: 250M
  ```
  - Added a explict schema name to the database service
  ```yaml
      config:
        schema: teched_2021
  ```
4. Add the [data model](./db/core.cds)
5. Add the [service](./srv/example.cds)
6. Add the [Rest Test Script](./test/example-service.http)

At this point you have the basic service that works locally and can be deployed (not working in the Cloud yet...).
