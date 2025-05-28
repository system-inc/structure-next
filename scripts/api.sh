# Store the project directory
projectDirectory=$PWD

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

# Copy the files from apiDirectory/workers/graphql/graphql/schemas intelligently
echo "Copying the generated GraphQL files to the appropriate directory..."
cp -r $apiDirectory/workers/api/graphql/schemas /tmp/api_schemas_temp

# Function to determine where each schema file should go
place_schema_file() {
    local filename="$1"
    local structure_path="$projectDirectory/libraries/structure/source/api/graphql/schemas/$filename"
    local project_path="$projectDirectory/app/_api/graphql/schemas/$filename"
    
    if [ -f "$structure_path" ]; then
        echo "  → $filename exists in structure, updating structure location"
        cp "/tmp/api_schemas_temp/$filename" "$structure_path"
    else
        echo "  → $filename not in structure, placing in project location"
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
            # Handle other schema files intelligently
            place_schema_file "$file"
        fi
    fi
done

# Clean up temp directory
rm -rf /tmp/api_schemas_temp

# Generate GraphQL code (which includes formatting)
echo "Generating GraphQL code and formatting..."
cd $projectDirectory
npm run graphql:generate
