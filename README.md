# feature-toggle-node
Node module for enabling or disabling node based SAP Business Application Studio features


## Description
This project is used to inquire if a SAP Business Application Studio feature toggle is enabled or disabled.

If an extension is written in NodeJS ot TypeScript and you would like to control the extension features via feature toggle, this library is the integrated way to use feature toggles in SAP Business Application Studio.


## Requirements

- ES2017 or higher



## Download and Installation

Install the feature-toggle-node as a dependency 

1. Import the extension into your SAP Business Application Studio. 

2. Open the command prompt at the root of your extension.

3. Add the feature-toggle-node to the dependency section of your package.json. In the command prompt type:
	```
	$ npm install feature-toggle-node --save
	```


### Configuration
Running The feature-toggle-node **locally** requires providing the following environment variables:
- `FT_SERVER_ENDPOINT` - Feature toggle server endpoint (mandatory)
- `WS_BASE_URL` - URL to the SAP Business Application Studio Cloud Foundry (mandatory)
- `USER_NAME` - User name of the SAP Business Application Studio logged in user (mandatory)- `FT_CLIENT_REFRESH_INTERVAL` - Feature toggle client refresh interval (optional, default value: 10s)
- `SHOW_LOG` - If true, display console logs (optional)

Environment variables example:

```
"FT_SERVER_ENDPOINT": "http://unleash.herokuapp.com",                
"WS_BASE_URL": "https://cfsubaccount-workspaces-ws-id.region.applicationstudio.cloud.sap",
"USER_NAME": "user@hotmail.com",
"FT_CLIENT_REFRESH_INTERVAL": "6s",
"SHOW_LOG": "true",
```

## Usage
Use the feature-toggle-node as following:

```
import { isFeatureEnabled } from "feature-toggle-node";

(async () => {  
  if (await isFeatureEnabled("EXTENSION_NAME", "FEATURE_TOGGLE_NAME")) {
    console.log(`Feature is Enabled`);
  } else {
    console.log(`Feature is Disabled`);
  }
})();
```

## How to obtain support
Please create an issue within this GitHub repository.


## License
Copyright (c) 2019-2020 SAP SE or an SAP affiliate company. All rights reserved.

This file is licensed under the Apache 2.0 License [except as noted otherwise in the LICENSE file](https://github.com/sap/feature-toggle-node/blob/master/README.md).
