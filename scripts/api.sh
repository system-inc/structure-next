# Store the projet directory
projectDirectory=$PWD

# Echo
echo "Updating GraphQL generated code..."

# Change to the api directory and pull the latest code
echo "Changing to the api directory..."
cd ../api
apiDirectory=$PWD

echo "Pulling the latest api code..."
git checkout main
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

# Change back to the project directory
echo "Changing back to the project directory..."
cd $projectDirectory

# Generate GraphQL code
echo "Generating project GraphQL code..."
npm run graphql:generate
