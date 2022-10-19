# Nodin-Task
Hey !!<br />
This is a practicing project to work with Adonis5<br />
This app contains register and login user.<br />
Any User can have own tasks and file<br />
and for management of tasks and account needs to be authenticate.<br />
The tecnology that used for authenticate is json web token (jwt).<br />
User first need login and get his own token <br />
then Used the token in auth part of api to get access.<br />
Even theres a reset part of password for the times that user forgot his password.<br />
And this project have an UI swagger for testing apis that available in "/docs" route<br />
Theres more description in UI swagger is available.<br />


GET START:<br />
1. first you must open ".env" file in your text editor(Atom,VScode or ....)<br />
2. there's some field for database connection:<br />
  - "MYSQL_HOST" by default set "localhost" but if you use mySQL in another server you must replace its link here.<br />
  - "MYSQL_PORT" should be fill by your database port<br />
  - "MYSQL_USER" name of your connection in database server<br />
  - "MYSQL_PASSWORD" password of your connection<br />
  - "MYSQL_DB_NAME" name of your database(After fill this part you need to create a database with this name in your connection of db)<br />
    . you can use "CREATE DATABASE db_name" command in terminal.<br />
3. After all open your ternimal and go to this apps directory.<br />
4. run "node ace migration:run" command in terminal to create tables.<br />
5. Now the app is ready, you can run "npm run dev" command to run server ...<br />
6. The app is run in "localhost:3333" now go to "localhost:3333/docs" to see UI swagger and use it!<br />
