set -e

npm run lint
npm install
npm run build
npm run test
