# Issue Tracking Tool Back End in Node JS
containing node js code required to run Issue Tracking Tool application. it includes all the internal and external modules required for the application.
front end has just to make a request to all the end points defined in node js application to render it or get the desired output.
i found node js is very easy to understand and learn.

## Getting Started
This instructions will tell you how to clone this to your localhost and run it.

### Prerequisites
 Note : you can skip installation steps if already installed in your system.
  1. Node JS (how to install? <a href="https://nodejs.org/en/download/">NodeJs</a>)
  
  2. Install Git (how to install? <a href="https://git-scm.com/downloads">Git Hub</a>)
  
### running locally
 
 1. create new folder in your system
 2. open that folder in cmd or linux terminal and execute following commands in sequence.
 
 ```
 > git init
 > git remote add origin https://github.com/bhaskar-repo/itt-back-end.git
 > git pull origin master
 > npm install
 ```
 above commands will pull project to your newly created folder. and npm install will add project dependencies.
 Note: index.js is the entry point to the node js application.
```
 > node index.js
```
### More About Application
Project Description: 

- This Project includes bunch of functinalities that i could think of.
- 1 -> LogIn
	1.1 -> Here I have followed the same approach that have been taught
	1.2 -> Field Validations, password, user existence,token generation and saving it to the cookie.

  2 -> Signup 
 	2.1 -> again field validations like password,user existence, encryption of password etc
	2.2 -> Upon Sign up user will be redirected to dashboard view.

  3  -> Dashboard
	3.1 -> Here all the issues are listed in table with filter,search and pagination
	3.2 -> on clik of row or issue title link user will be forwarded to the description of that issue.
	3.3 -> table shows the fields like status,title,date etc
  
  4  -> Description 
	4.1 -> Individual issue description is shown with all the details including title,assignee,reporter,start date etc
	4.2 -> here i have added some extra fields like priority and module.

  5  -> create
	5.1 -> only reporter can create the issue assignee can only edit
	5.2 -> here file upload is not mandatory 
	
  6  -> Edit 
	6.1 -> anybody including assignee and reporter can edit the issue
	6.2 -> assignee can assign same issue to any othe assignee

 Extra Points Added: 

	- In description view i have added slide toggle on toggling user will join that room or leave the room
	- i have done some experiment its not working perfect but as expected please try toggling multiple times
	- some extra fields added throughout the application.
	- reset password functinality is added kindly check that also.
	- there more many points added like file upload and download.
	- added jsdoc for almost all the methods.

 Technologies Used:
	
	- Angular + Angular Material design for front end
	- Express, Node for backend
	- multer library for uploading files
	- ckeditor library for formatting options
	
 Project structure - 
	- i have followed all the standard structure in Angular,Node JS and for models.

 important points:
	- I am using database for storing a secret key you need to add a one entry for {secretKey: value} in globalconfigs.
	- I have used material design so that i could not add that much responsiveness due to deadline rather focused on functinalities.
	- I am not using local storage to upload the files i am using amazon s3 .so that can be downloaded easily
	- In order to aassign or create issue you must add some assignee and reporters.

points to be noticed
	- reset password functionality 
	- joining and leaving the room on description view
	- on edit of issue all users who are part of that issue will be notified what has changed again this
	  try editing from all the ends to reflect this.

## Built With

* [NPM](https://www.npmjs.com/) - Most of the modules are used
* [nodemailer](https://nodemailer.com/about/) - NPM module to send the mails
* [apiDoc](http://apidocjs.com/) - NPM module to create the apiDoc and eventDoc
* [nodejs](https://nodejs.org)- Node js to write back end

## Authors

* **Bhaskar Pawar** - *Initial work* - [bhaskarpawar](https://github.com/bhaskar-repo)
* **Edwisor** - *Problem Statement* - [Edwisor](https://www.edwisor.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for detailsg

## Acknowledgments

* Thanks for Edwisor to review this application.
* I would like to thank whoever supported for implenting this back end for Issue Tracking Tool application.
