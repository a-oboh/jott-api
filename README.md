## Jott ⚡️📝

### Setting up

- You'd need to have `node js` installed
  
- Install Typescript globally via npm `npm install -g typescript`
  
- Clone repo and install dependencies `npm install`
  
- Run with `npm run dev`
  
- Run build with `npm run build`
  
- To run DB migrations: `npx ts-node ./node_modules/.bin/typeorm migration:generate -n MigrationName`

- Run mysql in container docker exec -ti jott-api_db_1 mysql -uusername -ppassword