# Cypress Base Project 

>This project aims to implement a general guideline and structure easy to follow for all Hugers


## Prerequisites

You need to have previously installed the following tools

[![java](https://img.shields.io/badge/java-v8-yellow.svg)](https://www.oracle.com/java/technologies/downloads/#java8)
[![java](https://img.shields.io/badge/nodejs-v14X-red.svg)](https://nodejs.org/en/download)


>## Table of Contents  
 - [HugeBaseProject]  
  - [Table of Contents](#Table-of-Contents)  
   - [Requirements](#Requirements)  
   - [The project directory structure](#The-project-directory-structure)  
   - [Inputs](#Inputs)  
   - [Outputs](#Outputs)  
   - [Installation](#Installation)  
   - [Example usage](#Example-usage)  
   - [ used technology stack  ](#Further-Reading--Useful-Links)  

## Requirements  
| Name      | Version |  
| --------- | ------- | 
| java | > = 8.x |  
| node | > = 14.x |

## The project directory structure
​
The project is compiled for Node Package Manager and follows the standard directory structure used in most Cypress projects implementing custom commands, DRY and KISS patterns:
```Gherkin
src
  + cypress                               | Location of automation source files                               
    + e2e                                 | Contains all the tests 
    + fixtures                            | .json files to store all isolated data required to execute the tests 
    + support                             | Contains elements, commands and  
        + commands                        | Custom commands that simulate the user interactions                      
        + elements                        | Defined constants that include the DOM locators
        + utilities.js                    | Common functions 
        + e2e.js                          | Class to import all created commands
+ cypress.config.js                       | Global Cyopress configuration. The most important variable here is the baseUrl
+ package.json                            | Node package manager
    
```

## Inputs  
| Name | Description | Values |  
| ------------------ | -------------------------- |  -------------------------- |  
| none |N/A | N/A |
## Outputs  
| Name               | Description                |  
| ------------------ | -------------------------- |  
| Allure reports   |   native and descriptive reports on the final state of the tests, the test results will be recorded in the allure-report directory open the index.html file
## Installation
​We use [NPM](https://nodejs.org/en), a cross-platform build automation tool that help with our full development flow. ​

* `git@github.hugeinc.com:stetovar/base_cypress_framework.git` this repository
* change into the new directory `cd base_cypress_framework`.
* you can import the project in Visual Studio, like [this](https://learn.microsoft.com/en-us/visualstudio/get-started/tutorial-open-project-from-repo?view=vs-2022)

### Dependencies Installation

npm install

### Allure Reports Installation

npm install -g allure-commandline --save-dev


## Example usage  
```bash  
 npx cypress run --env allure=true
 allure generate --clean
 allure open
```
Note: Only for LDAP, open the report url in Firefox.
## Outputs  

the scenarios used during automation were the following

| Name               | Description                |  
| ------------------ | -------------------------- |  
| register.cy.js   |  Validation of the creation of a user  |
|
## used technology stack  
* [MarkDown guide](https://www.markdownguide.org/getting-started/)  
* [DRY, KISS Patterns](https://vpodk.medium.com/principles-of-software-engineering-6b702faf74a6)  
* [JDK (Java Development Kit)](https://www.oracle.com/java/technologies/javase-downloads.html)  
* [SonarQube](https://www.sonarqube.org/) 
* [BDD (Behavior-Driven Development)](http://www.thucydides.info/#/)
* [Allure Reports](https://github.com/Shelex/cypress-allure-plugin)

>Authors:  
>  Raptor Team :t-rex:
>  That's it, We hope you like it
>  
