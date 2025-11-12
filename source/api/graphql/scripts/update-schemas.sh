# Store the project directory
projectDirectory=$PWD

# Define which modules belong in the structure library
# These modules are shared across projects and part of the structure framework
STRUCTURE_MODULES=(
    "Account"
    "Contact"
    "DataInteraction"
    "Logging"
    "Metrics"
    "Post"
    "Support"
)

# Extract project title from ProjectSettings.ts
echo "Reading project title from ProjectSettings.ts..."
projectTitle=$(grep "title:" $projectDirectory/ProjectSettings.ts | head -1 | sed "s/.*title: '//" | sed "s/',.*//")
echo "Project title: $projectTitle"

# Set defaults
apiDirectory="api"
projectBranch="main"
baseBranch="main"

# Parse named arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --api-directory)
      apiDirectory="$2"
      shift 2
      ;;
    --project-branch)
      projectBranch="$2"
      shift 2
      ;;
    --base-branch)
      baseBranch="$2"
      shift 2
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done


# ==================================================
# GraphQL Schema Update Script
# ==================================================

echo ""
echo "🔄 Starting GraphQL schema update..."
echo "=================================================="
echo ""

# --------------------------------------------------
# Step 1: Update API Directory
# --------------------------------------------------
echo "📁 Updating API directory..."
echo "  → Changing to: $apiDirectory"
cd ../$apiDirectory
apiDirectory=$PWD

# Initialize and update git submodules in the api directory
echo "  → Initializing and updating git submodules..."
git submodule update --init --recursive

echo "  → Pulling the latest API code from branch: $projectBranch"
git checkout $projectBranch
git pull
echo "  ✓ API directory updated"
echo ""

# --------------------------------------------------
# Step 2: Update Nexus Library (if exists)
# --------------------------------------------------
if [ -d "libraries/nexus" ]; then
    echo "📚 Updating Nexus library..."
    echo "  → Changing to libraries/nexus"
    cd libraries/nexus
    echo "  → Pulling latest Nexus code from origin/main"
    git pull origin main
    cd ../../
    echo "  ✓ Nexus library updated"
else
    echo "⚠️  Nexus library directory not found, skipping..."
fi
echo ""

# --------------------------------------------------
# Step 3: Update Base Library
# --------------------------------------------------
echo "📚 Updating Base library..."
echo "  → Changing to libraries/base"
cd libraries/base
baseLibraryDirectory=$PWD
echo "  → Pulling latest Base library code from origin/main"
git pull origin main
echo "  ✓ Base library updated"
echo ""

# Install packages
cd ../../

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use
else
    echo "nvm not found, continuing with current node version: $(node --version)"
fi

# --------------------------------------------------
# Step 4: Install Dependencies
# --------------------------------------------------
echo "📦 Installing dependencies..."
echo "  → Running pnpm install"
pnpm install --no-audit
echo "  ✓ Dependencies installed"
echo ""

# --------------------------------------------------
# Step 5: Generate GraphQL Schemas
# --------------------------------------------------
echo "🔨 Generating GraphQL schemas..."
echo "  → Running base.js graphql schema:generate"
node base.js graphql schema:generate -w api -e Production -s -m

# Function to check if a module belongs in structure
is_structure_module() {
    local module_name="$1"
    for structure_module in "${STRUCTURE_MODULES[@]}"; do
        if [ "$structure_module" = "$module_name" ]; then
            return 0
        fi
    done
    return 1
}

# --------------------------------------------------
# Step 6: Clean and Organize Schema Files
# --------------------------------------------------
echo ""
echo "🧹 Cleaning up existing schema files..."
# Remove all .graphql and .json files from both directories (except .DS_Store)
find "$projectDirectory/app/_api/graphql/schemas" -type f \( -name "*.graphql" -o -name "*.json" \) ! -name ".DS_Store" -exec rm -f {} \;
find "$projectDirectory/libraries/structure/source/api/graphql/schemas" -type f \( -name "*.graphql" -o -name "*.json" \) ! -name ".DS_Store" -exec rm -f {} \;
echo "  → Removed existing schema files"

# Copy the files from apiDirectory/workers/graphql/graphql/schemas intelligently
echo ""
echo "📋 Organizing schema files by module type..."
cp -r $apiDirectory/workers/api/graphql/schemas /tmp/api_schemas_temp

# Function to determine where each schema file should go based on module list
place_schema_file() {
    local filename="$1"
    local module_name="${filename%%.*}"  # Extract module name without extension
    local structure_path="$projectDirectory/libraries/structure/source/api/graphql/schemas/$filename"
    local project_path="$projectDirectory/app/_api/graphql/schemas/$filename"

    if is_structure_module "$module_name"; then
        echo "  → $filename is a structure module, placing in structure location"
        cp "/tmp/api_schemas_temp/$filename" "$structure_path"
    else
        echo "  → $filename is a project module, placing in project location"
        cp "/tmp/api_schemas_temp/$filename" "$project_path"
    fi
}

# Process each schema file intelligently
cd /tmp/api_schemas_temp
for file in *.graphql *.json; do
    if [ -f "$file" ]; then
        if [ "$file" = "api.graphql" ] || [ "$file" = "api.json" ]; then
            # Handle project-specific api files
            extension="${file##*.}"
            project_filename="$projectTitle.$extension"
            echo "  → Renaming $file to $project_filename for project"
            cp "$file" "$projectDirectory/app/_api/graphql/schemas/$project_filename"
        else
            # Handle other schema files based on module list
            place_schema_file "$file"
        fi
    fi
done

# Clean up temp directory
rm -rf /tmp/api_schemas_temp

# --------------------------------------------------
# Step 7: Format and Generate TypeScript Code
# --------------------------------------------------
cd $projectDirectory
echo ""
echo "💅 Formatting schema files..."
pnpm graphql:prettier

# Generate GraphQL code (which includes formatting)
echo ""
echo "🚀 Generating TypeScript code from schemas..."
pnpm graphql:generate

echo ""
echo "=================================================="
echo "✅ GraphQL schema update complete!"
echo "=================================================="
echo ""
