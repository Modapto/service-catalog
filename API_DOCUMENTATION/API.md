## Return the service list:

`GET https://services.modapto.atc.gr/micro-service-controller-rest/rest/msc/callMicroserviceCustomIO/2daf6c38-4579-4929-8d72-4d869c9bcc4e/getServicesList`

OUTPUT SAMPLE:
```
{
  "list": [
    {
      "id": "c821f2eb-d16c-4b06-829a-9a2396872f42",
      "name": "Prognostics_External_Service",
      "description_short": "The service perform the optimization of robot movements for the FFT robot code.",
      "logo": "",
      "affiliation": "BOC",
      "keywords": "test",
      "type": "external"
    },
    {
      "id": "3b21dcca-0510-435b-8a75-a7c80747146f",
      "name": "Prognostics_Internal_Service",
      "description_short": "The service perform the optimization of robot movements for the FFT robot code.",
      "logo": "",
      "affiliation": "BOC",
      "keywords": "test",
      "type": "internal"
    }
  ]
}
```

## Return the single service by providing the service id as query parameter:

`GET https://services.modapto.atc.gr/micro-service-controller-rest/rest/msc/callMicroserviceCustomIO/2daf6c38-4579-4929-8d72-4d869c9bcc4e/getService?id=<SERVICE_ID>`

SAMPLE:

`GET https://services.modapto.atc.gr/micro-service-controller-rest/rest/msc/callMicroserviceCustomIO/2daf6c38-4579-4929-8d72-4d869c9bcc4e/getService?id=c821f2eb-d16c-4b06-829a-9a2396872f42`

OUTPUT SAMPLE:
```
{
  "id": "c821f2eb-d16c-4b06-829a-9a2396872f42",
  "name": "Prognostics_External_Service",
  "description_short": "The service perform the optimization of robot movements for the FFT robot code.",
  "description_long": "\u003Cp\u003E...\u003C/p\u003E",
  "sources": "http://127.0.0.1:8080/",
  "logo": "",
  "affiliation": "BOC",
  "contact": "damiano.falcioni@boc-group.com",
  "keywords": "test",
  "type": "external",
  "input": [],
  "output": [
    {
      "modelType": "Property",
      "idShort": "RUL_prediction",
      "valueType": "xs:string"
    },
    {
      "modelType": "Property",
      "idShort": "UNIX_timestamp",
      "valueType": "xs:string"
    },
    {
      "modelType": "Property",
      "idShort": "engine_index",
      "valueType": "xs:string"
    }
  ],
  "restDetails": {
    "endpoint": "https://services.modapto.atc.gr/prognostics/analysis?engine_index=12",
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    },
    "outputMapping": {

    },
    "payload": ""
  }
}
```