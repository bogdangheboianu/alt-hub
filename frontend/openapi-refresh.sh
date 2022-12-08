openapi-generator-cli generate \
  -g typescript-angular \
  -i http://localhost:3000/swagger-json  \
  -o src/app/dtos \
  --enable-post-process-file \
  -c openapi-generator.config.json \
  --api-package test &&
  find src/app/dtos -type f -not -name "*dto.ts" -and -not -name "any-type*" -and -not -name "*-enum.ts" -print0 | xargs -0 -I {} rm {} &&
  rm -Rf src/app/dtos/.openapi-generator
  rm -Rf src/app/dtos/test &&
  mv src/app/dtos/model/* src/app/dtos &&
  rm -Rf src/app/dtos/model
