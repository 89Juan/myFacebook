# MYFACEBOOK INFO

Web application for publication of content (photos, events,...) developed in the course of Web Applications Development.

* Express
* Node.js
* MongoDB

## Folder Structure

Structured in 5 main folders:

* controllers: operations on the data structure
* files: contains 2 json files that correspond to 2 collections on the database
* models: application's data structure
* routes: application's endpoints (URIs)
* views: application's frontend

## Backend

The server is fetching data from MongoDB (listening on port 27017 in localhost).

## Frontend

Is fetching data from port 2018 in localhost.

## Start Guide

#### 1. Install MongoDB
Install [MongoDB](https://docs.mongodb.com/manual/installation/) on your machine and make sure it's running correctly.

#### 2. Create the DB
In the mongo shell, create the database `myFacebook`:
  ```
  >use myFacebook
  switched to db myFacebook
  ```

Then, create the collections `utilizadores` and `items`:
  ```
  >db.createCollection("utilizadores")
  { "ok" : 1 }
  >db.createCollection("items")
  { "ok" : 1 }
  ```

#### 3. Run the APP
Inside the folder `myFacebook`, on your command line make:
  ```
  npm install
  ```

Followed by:
  ```
  npm start
  ```

The application is now running and available in <http://localhost:2018>.

