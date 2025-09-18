# Store the project directory
projectDirectory=$PWD

# Define which modules belong in the structure library
# These modules are shared across projects and part of the structure framework
STRUCTURE_MODULES=(
    "Account"
    "AppleAppStore"
    "Commerce"
    "Contact"
    "DataInteraction"
    "Forms"
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


# Echo
echo "Updating GraphQL generated code..."

# Change to the api directory and pull the latest code
echo "Changing to the $apiDirectory directory..."
cd ../$apiDirectory
apiDirectory=$PWD

echo "Pulling the latest api code..."
git checkout $projectBranch
git pull

# Change to the base directory and pull the latest code
echo "Changing to the base library directory..."
cd libraries/base
baseLibraryDirectory=$PWD

echo "Pulling the latest base library code..."
# git checkout main
git pull

# Generating the base library GraphQL code
echo "Changing to the api directory..."
cd ../../

echo "install packages..."
npm i

echo "Generating base library GraphQL code..."
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

# Clean up existing schema files before copying new ones
echo "Cleaning up existing schema files..."
# Remove all .graphql and .json files from both directories (except .DS_Store)
find "$projectDirectory/app/_api/graphql/schemas" -type f \( -name "*.graphql" -o -name "*.json" \) ! -name ".DS_Store" -exec rm -f {} \;
find "$projectDirectory/libraries/structure/source/api/graphql/schemas" -type f \( -name "*.graphql" -o -name "*.json" \) ! -name ".DS_Store" -exec rm -f {} \;
echo "  → Removed existing schema files"

# Copy the files from apiDirectory/workers/graphql/graphql/schemas intelligently
echo "Copying the generated GraphQL files to the appropriate directory..."
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
echo "Processing schema files..."
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

# Format the schema files with prettier before generating code
echo "Formatting schema files with Prettier..."
cd $projectDirectory
npm run graphql:prettier

# Generate GraphQL code (which includes formatting)
echo "Generating GraphQL code..."
npm run graphql:generate
