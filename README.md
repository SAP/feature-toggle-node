[![CircleCI](https://circleci.com/gh/SAP/feature-toggle-node.svg?style=svg)](https://circleci.com/gh/SAP/feature-toggle-node)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://api.dependabot.com/badges/status?host=github&repo=SAP/feature-toggle-node)](https://dependabot.com/)

# feature-toggle-node 
A Node.js module for enabling or disabling Node.js-based SAP Business Application Studio features.


## Description
This module is used to inquire if an SAP Business Application Studio feature toggle is enabled or disabled.

This module should be used if your SAP Business Application Studio extension is written in Node.js or TypeScript and you want to control the extension features via feature toggle.


## Requirements

- ES2017 or higher



## Download and Installation

Install the feature-toggle-node as a dependency. 

1. Import the extension into your SAP Business Application Studio. 

2. Open the command prompt at the root of your extension.

3. Add the feature-toggle-node to the dependency section of your 'package.json' file by entering the following in the command prompt:

	```
	$ npm install @sap-devx/feature-toggle-node --save
	```


### Configuration
To run the feature-toggle-node **locally**, you need to provide the following environment variables:
- `FT_SERVER_ENDPOINT` - Feature toggle server endpoint (mandatory)
- `WS_BASE_URL` - URL to the SAP Business Application Studio Cloud Foundry (mandatory)
- `USER_NAME` - Name of the user logged into SAP Business Application Studio (mandatory)
- `FT_CLIENT_REFRESH_INTERVAL` - Feature toggle client refresh interval (optional, default value: 10s)
- `SHOW_LOG` - If true, displays console logs (optional)

Environment variables example:

```
"FT_SERVER_ENDPOINT": "http://unleash.herokuapp.com",                
"WS_BASE_URL": "https://cfsubaccount-workspaces-ws-id.region.applicationstudio.cloud.sap",
"USER_NAME": "user@hotmail.com",
"FT_CLIENT_REFRESH_INTERVAL": "6s",
"SHOW_LOG": "true",
```

## Usage
Use the feature-toggle-node as follows:

```
import { isFeatureEnabled } from "@sap-devx/feature-toggle-node";

(async () => {  
  if (await isFeatureEnabled("EXTENSION_NAME", "FEATURE_TOGGLE_NAME")) {
    console.log(`Feature is Enabled`);
  } else {
    console.log(`Feature is Disabled`);
  }
})();
```

## How to obtain support
Open an issue within this GitHub repository.