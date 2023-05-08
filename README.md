Introduction
This is a web application hosted on Carrd, designed as a front-end portal for Sweetwater's available opportunities, specifically for students enrolled in PFW's Music Industry and Popular Music degree programs. The web application provides information on the partnership and the benefits it offers to School of Music students before logging in.

Description
Once registered, students can set their password using forgot password functionality. After that users can login to the application using their credentials and access the available sweetwater opportunities, configure their badge photo and see their account information.

For more information, please refer to the project glossary in the documentation.

Deployment Steps  for RESTful APIs:
To deploy the Node.js API through Netlify Functions using Visual Studio Code command, follow these steps:

Install the Netlify CLI by running the following command in your terminal:
npm install netlify-cli -g

Build your Node.js API by running the following command:
npm run build

## RESTful APIs deployment using Netlify reference
To deploy RESTful APIs we referred the following article:
https://awstip.com/express-server-on-netlify-for-free-step-by-step-guide-e5fbdb47d891 


Create a Netlify account and create a new site from the Netlify dashboard. 

Create a new file called netlify.toml in your project root folder and add the following controls to it:
[build]
  command = "npm run build"
  publish = "dist"
  functions = "functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"

Initialize a new Git repository in your project root folder by running the following command:
git init

Add and commit your changes to the Git repository:
git add .
git commit -m "Initial commit"

Link your project to your Netlify site by running the following command:
netlify link

Deploy your project to Netlify by running the following command:
netlify deploy --prod

## Netlify deployed APIs
Once the deployment is complete, the Node.js API will be available at the following URL:
https://app.netlify.com/sites/dapper-pika-dbaf53/functions

## Deployment Steps  for Front end:
Overview
In this project, we created an HTML file using Visual Studio Code with JavaScript and Axios calls. We also added the Bootstrap library, and everything was contained in the same file. Finally, we used the embed option in Carrd to deploy the code.

### Steps to embed client side code
#### Client side implmentation code is available on GitHub repo.
To deploy the front-end code, follow the steps below:

1.Create an HTML file using Visual Studio Code.
2.Add JavaScript code to make the necessary API calls.
3.Add the Bootstrap library to the file.
4.Save the file and copy its contents.
5.Log in to your Carrd account and select the website where you want to deploy the code.
6.Click on the "Embed" option in the left-hand menu.
7.Paste the HTML code into the Embed code section.
8.Click on the "Save" button.
9.Preview the website to ensure the code has been successfully deployed.
