import { AppStudioMultiContext, createContextObject } from "./appstudio_context";

// Map of context.
// map key = extensionName
// map value = appStudioContext
const contextMap = new Map<string, AppStudioMultiContext>();

function createNewContext(extensionName: string): AppStudioMultiContext {
  // TODO: collect the data
  const context: AppStudioMultiContext = createContextObject();

  //add the context to the map
  contextMap.set(extensionName, context);

  return context;
}

export function getContextFromMap(extensionName: string, contextMap: Map<string, AppStudioMultiContext>): AppStudioMultiContext {
  // If the context exist in the map return it
  const contextClient = contextMap.get(extensionName);
  if (contextClient) {
    return contextClient;
  }

  // The context does NOT exist in the map -> create a new context
  return createNewContext(extensionName);
}

export function getContext(extensionName: string): AppStudioMultiContext {
  return getContextFromMap(extensionName, contextMap);
}
