# Boilerplate for NodeJS server running MongoDB with Typescript

This project is a boilerplate for a NodeJS Server running native MongoDB(without Mongoose) with Typescript. It also shows how to write Integration tests with Jest and Supertest.

## Project Structure

The file structure of this project is similar to [NestJS](https://github.com/nestjs/nest) where files are organised by feature, e.g /user folder will contain the user model, user routes, controller and user tests. Most of the app files are inside the /api folder.

## Development

1. Clone or download project.
2. Make an empty '.env' file in project root directory. Copy the content of '.env.example' file into your .env.
3. Make sure you update the MONGO_URL valriable so it's pointing to a runing MongoDB database in your local machine. I've included docker-compose file that sets up a mongodb for you if you have Docker installed.
4. Make sure you have the 'nodemon' package installed globally on your machine. Run `npm i` followed by `nodemon` to start developing.
