setup-frontend:
  npm i

build-api:
  npx openapi-generator-cli generate -i src/js/api/api.yaml -g typescript -o src/js/generated/

run-frontend:
  cd config/webpack && npx webpack serve

run-backend:
  cd src/app && go run cmd/server.go

validate-repo:
   npx eslint . --ext .jsx --ext .js --ext .ts --ext .tsx
   npx stylelint "{src,config}/**/*.{css,scss,sass}" --config .stylelintrc.json

