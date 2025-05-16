#!/bin/bash
# Script to generate a standalone Swagger documentation site

# Configuration
OPENAPI_SPEC_PATH="./openapi-spec.json"
OUTPUT_DIR="./swagger-docs"
SWAGGER_UI_VERSION="4.18.3"
SWAGGER_UI_URL="https://github.com/swagger-api/swagger-ui/archive/v${SWAGGER_UI_VERSION}.zip"
TEMP_DIR="./swagger-ui-temp"

# Print header
echo "=========================="
echo "Swagger UI Generator"
echo "=========================="

# Check if OpenAPI spec exists
if [ ! -f "$OPENAPI_SPEC_PATH" ]; then
  echo "Error: OpenAPI specification file not found at $OPENAPI_SPEC_PATH"
  echo "Please run the NestJS application once to generate the spec file"
  exit 1
fi

# Create temporary directory
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"

# Download Swagger UI
echo "Downloading Swagger UI v${SWAGGER_UI_VERSION}..."
curl -sL "$SWAGGER_UI_URL" -o "${TEMP_DIR}/swagger-ui.zip"

# Extract Swagger UI
echo "Extracting Swagger UI..."
unzip -q "${TEMP_DIR}/swagger-ui.zip" -d "$TEMP_DIR"

# Create output directory
echo "Preparing output directory..."
mkdir -p "$OUTPUT_DIR"

# Copy necessary files
echo "Copying Swagger UI files..."
cp -r "${TEMP_DIR}/swagger-ui-${SWAGGER_UI_VERSION}/dist/." "$OUTPUT_DIR"

# Copy OpenAPI spec
echo "Copying OpenAPI specification..."
cp "$OPENAPI_SPEC_PATH" "${OUTPUT_DIR}/swagger.json"

# Create custom index.html
echo "Customizing Swagger UI..."
cat > "${OUTPUT_DIR}/index.html" << EOL
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KINE-SAAS API Documentation</title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
  <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    body {
      margin: 0;
      background: #fafafa;
    }

    .topbar {
      background-color: #2d8dc3 !important;
    }
  </style>
</head>

<body>
  <div id="swagger-ui"></div>

  <script src="./swagger-ui-bundle.js" charset="UTF-8"> </script>
  <script src="./swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
  <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        url: "swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'list'
      });
      // End Swagger UI call region
      window.ui = ui;
    };
  </script>
</body>
</html>
EOL

# Clean up temporary files
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "=========================="
echo "Swagger UI documentation has been generated at $OUTPUT_DIR"
echo "You can open $OUTPUT_DIR/index.html in a browser to view the documentation"
echo "To share the documentation, zip the $OUTPUT_DIR folder and distribute"
echo "=========================="
