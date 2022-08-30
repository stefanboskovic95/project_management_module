### Prerequisites
1. Node - version used v16.16.0
2. Npm - version used 8.11.0
3. Repository cloned to directory of your choosing. e.g. `C:\code\project_management_module`.

### Running Backend
1. Navigate to `C:\code\project_management_module\backend` from cmd.
2. Run `npm install` to install project dependencies defined in `backend\package.json`.
3. Create `.env` file based on `example.env` file - populate DB name, DBMS user and password.
4. Create DB with name you supplied in `.env` file.
5. Run `npm init-db` to migrate DB models and populate DB with example data.
6. Run `npm run dev` to run backend.

### Running Frontend
1. Navigate to `C:\code\project_management_module\frontend` from cmd.
2. Run `npm install` to install project dependencies defined in `frontend\package.json`.
3. Run `ng serve` to run backend.
4. Open `localhost:4200` in your browser to open frontend.

### Users
All users have password s123, except admin. Admin panel allows user management.
CPX department is populated with sample projects and project items to make testing more easy.

                                   admin // password: Tranquility78@.'

            CPX Department        INV Department        UTIL Department
                  |                     |                     |
                  |                     |                     |
              sboskovi           |   mandrije       |      gstancev     // Department chiefs
    mmatejic, mstojkov, urnastic |   gkundaci       |      mivanovi     // Department Officials
    avasilje, aboljano, agrubaci |   svukovic       |      krokosov     // Regular users
