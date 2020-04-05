# feature-toggle-client-ts-node
Feature toggle client API for working with feature toggles in Kubernetes applications based typescript.

### Configuration
The feature toggle client requires you to provide environment variables:
- `FT_SERVER_ENDPOINT` - Feature toggle server endpoint (mandatory)
- `FT_CLIENT_REFRESH_INTERVAL` - Feature toggle client refresh interval (optional, default value is 10s)


### API

The API exposes the following method: 
- `IsFeatureEnabled`


##### IsFeatureEnabled
 
`async function isFeatureEnabled(extensionName: string, featureToggleName: string, oContext?: Context): Promise<boolean>`

This method checks if a specific feature toggle is enabled (returns "true") or disabled (returns "false").
 

##### Example:    

```
import { isFeatureEnabled } from "feature-toggle-client-ts-node";

(async function test(){
    //check default strategy
    const result: boolean = await isFeatureEnabled ("extName","featureName");
	if (result) {
		console.log("The feature extName.featureName is enabled");
	} else {
		console.log("The feature extName.featureName is disabled");
	}	
})();
```   


 