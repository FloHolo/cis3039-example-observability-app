# Observable Frontend App Example

## Local Setup

```bash
npm install
```

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Type-Check, Compile and Minify for Production

```bash
npm run build
```

## Azure Setup

### Publish the app to an Azure Storage Account (static website)

1. Create a Storage Account suited for static sites:

```bash
az storage account create \
  --name weekeightva96appsa \
  --resource-group weekeight-va96-rg \
  --location uksouth \
  --sku Standard_LRS \
  --kind StorageV2
```

2. Enable static website and set the index page

```bash
az storage blob service-properties update \
  --account-name weekeightva96appsa \
  --static-website \
  --index-document index.html \
  --404-document index.html
```

3. Build the SPA and upload the contents of dist to the `$web` container:

```bash
# build
npm run build

# publish
az storage blob upload-batch \
  --account-name weekeightva96appsa \
  --source ./dist \
  --destination '$web' \
  --overwrite

# get URL
az storage account show \
  --name weekeightva96appsa \
  --resource-group weekeight-va96-rg \
  --query "primaryEndpoints.web" \
  --output tsv
```

# https://weekeightva96appsa.z33.web.core.windows.net/

4. Add your storage site to CORS on the Function App (so the deployed web app can access the web service):

```bash
az functionapp cors add \
  --name weekeight-va96-app \
  --resource-group weekeight-va96-rg \
  --allowed-origins https://weekeightva96appsa.z33.web.core.windows.net
```

### Configure the Monitoring

1. Create a Log Analytics Workspace (if you don't already have one for this environment):

```bash
az monitor log-analytics workspace create \
  --name weekeight-va96-logs \
  --resource-group weekeight-va96-rg \
  --location uksouth
```

2. Create an Application Insights resource for the frontend app:

```bash
az monitor app-insights component create \
  --resource-group weekeight-va96-rg \
  --location uksouth \
  --app weekeight-va96-insights \
  --workspace weekeight-va96-logs \
  --kind web
```

> Your version of the CLI may ask permission to upgrade the extension: say Y

3. Get the Application Insights connection string (for SPA env var):

```bash
az monitor app-insights component show \
  --resource-group <your-resource-group> \
  --app <app-insights-name> \
  --query connectionString \
  -o tsv
```

Assign the connection string to the `VITE_APPINSIGHTS_CONNECTION_STRING` env var in your `.env.local`

4. Rebuild and republish the SPA

Because SPAs bake their environment variables in at build time, you must rebuild and republish the app for the new telemetry environment variable to take affect.

```bash
# build
npm run build

# publish
az storage blob upload-batch \
  --account-name <productappstoragename> \
  --source ./dist \
  --destination '$web' \
  --overwrite
```

## Azure Application Insights Telemetry Setup

This application has been configured with Azure Application Insights for comprehensive telemetry tracking.

- **`useTelemetry`**: A Vue composable in `src/composables/useTelemetry.ts` that directly wraps Azure Application Insights
  - Initializes App Insights on first use
  - Returns helper functions for tracking events, exceptions, dependencies, metrics, and page views
  - Handles missing configuration gracefully

The telemetry composable is used throughout the application:

```typescript
import { useTelemetry } from '@/composables/useTelemetry';

const {
  trackEvent,
  trackException,
  trackDependency,
  trackMetric,
  trackPageView,
} = useTelemetry();

// Track events
trackEvent('UserAction', { details: 'value' });

// Track exceptions
trackException(error, { context: 'componentName' });

// Track dependencies (API calls)
trackDependency('API Call', url, duration, success, statusCode);

// Track metrics
trackMetric('MetricName', value);

// Track page views
trackPageView('PageName', url);
```

## How the project was made

```bash
npm create vue@3 . -- \
  --force \
  --bare \
  --typescript \
  --router \
  --prettier
```

Restore any delete devcontainer configuration:

```bash
git restore .devcontainer/devcontainer.json
```

Add extensions to devcontainer:

- `"esbenp.prettier-vscode"`,
- `"Vue.volar"`

Update preferences in `.prettierrc.json`:

- `"semi": true`
- `"singleQuote": true`
- `"printWidth": 80`
