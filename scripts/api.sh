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

# Copy the files from apiDirectory/workers/graphql/graphql/schemas to projectDirectory/source/api/schemas
echo "Copying the generated GraphQL files to the project directory..."
cp -r $apiDirectory/workers/api/graphql/schemas $projectDirectory/source/api/

# Rename api.graphql and api.json to use project title
echo "Renaming api files to use project title ($projectTitle)..."
cd $projectDirectory/source/api/schemas
if [ -f "api.graphql" ]; then
    mv api.graphql "$projectTitle.graphql"
    echo "Renamed api.graphql to $projectTitle.graphql"
fi
if [ -f "api.json" ]; then
    mv api.json "$projectTitle.json"
    echo "Renamed api.json to $projectTitle.json"
fi

# Format the schema files
echo "Formatting GraphQL schema files..."
cd $projectDirectory
npx @system-inc/prettier@3.2.1 --write "./source/api/schemas/**/*"

# Generate GraphQL code
echo "Generating project GraphQL code..."
npm run graphql:generate
