# Database Project

There will be multiple modules and roles in this project. This is list of the modules and roles are as follows:

> Super Admin

> Admin

> Team Leader/Database Owner

> User/Worker

---

## IDEAS:

After registration, when a user logs in, the role of the user should be immediately checked. If the user has any other role than a simple user, they should be asked which role they want to view the site as(something like a modal). What ever role the person chooses, they should be redirected to that view. The views are as follows:

- ### Simple User:
  First and foremost user’s data should be checked. If there is any field in the database missing, users should get a message saying “Complete your profile for better experience”. Simple Users should only be able to see the databases of which they are part of. It can be multiple databases but all databases should be different and should not collide with each other. Users should be able to enter data to the databases they are part of. When the data is entered, users should be able to see the table where the data will be shown. The table should consist of the title, date created/updated, user who created that entry and it should be clickable. When the users click the entry a new page should be generated with all of the information about that entry.
  The following pages must be added for users:
  - Profile Page
  - Setting
  - Home
  - Databases
- ### Team Leader/Database Owner:
  // info here
- ### Website Admin/Moderator:
  // info here
- ### Super Admin:
  // info here

---

## APIs:

Following are the working APIs:

- ### controller/adminController.js:

  - #### setRole()

    This API allows an admin to update the role of the user.

  - #### findUser()
    This API allows an admin to find user by their email.

- ### controller/auth.js:

  - #### signup()

    This API allows the users to signup.

  - #### login()
    This API allows the users to login.

- ### controller/post-data.js:

  - #### postData()

    This API allows the users to upload a post/entry.

  - #### getData()

    This API find a post by it's ID.

  - #### updateData()

    This API allows the users to update the data.

  - #### deletePost()

    This API allows the users to delete a post/entry.

  - #### allPosts()
    This API returns all the posts made in the database.

- ### controller/superAdmin.js:

  - #### deleteUser()
    This API allows the Super Admins to delete a user.

- ### controller/user.js:

  - #### editUser()

    This API allows the users to update their profile data.

  - #### userPosts()

    This API returns all the posts created by the logged in user.

- ### controller/databaseControllers/dbAdmin.js:

  - #### createDatabase()

    This API allows the users to a new database.

  - #### addNewMember()

    This API allows the admins to add new members to the database.

  - #### removeUsers()

    This API allows the admins to remove members from the database.

  - ### controller/databaseControllers/dbUser.js:

  - #### getUsers()

    This API allows the users to a get members of the current database.

  - #### getPosts()

    This API returns all the posts in the database.
