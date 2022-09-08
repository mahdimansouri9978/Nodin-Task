/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// *************************************************

// ####### You can test apis in "/docs" route ######

// *************************************************

// Users Routes
Route.group(() => {
  
  Route.post("/register", "UsersController.register")

  Route.post("/login", "UsersController.login")

  Route.patch("/", "UsersController.forgot")

  Route.delete("/", "UsersController.delete").middleware("auth")

  Route.put("/", "UsersController.update").middleware("auth")

  Route.get("/", "UsersController.show").middleware("auth")

}).prefix("/users")


// Tasks Routes
Route.group(() => {
  Route.get("/all", "TasksController.show")

  Route.get("/show", "TasksController.showOne")

  Route.get("/search", "TasksController.search")

  Route.get("/sort", "TasksController.sort")

  Route.post("/", "TasksController.create")

  Route.put("/", "TasksController.update")

  Route.delete("/delete", "TasksController.delete")

}).prefix("/tasks").middleware("auth")