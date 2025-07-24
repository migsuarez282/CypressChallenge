# Cypress Testin Lab Challenge

>This project aims to implement a general AT framework and structure an easy base project, to validate the core functionalities for the Test lab ecommerce and start a Test Automation strategy.

## General aspect to consider in the Test Automation Strategy worked:

>## Documents to have into account
* [Web Site tested](https://www.laboratoriodetesting.com/)
* [Test Plan V1](https://docs.google.com/document/d/1P4Tix-HGA30UYdlS80SjJ_LB6GdscIubR7Ags4gqyIA/edit?usp=sharing)
* [Test Cases V1](https://docs.google.com/document/d/1xsE936enKd_crHeP5QSu1eJIIBF8IG7VSAHXoG8DneU/edit?tab=t.0)
* [Test Strategy draft](https://docs.google.com/document/d/1Enr7PuIIMbrNKpNl-WblC_zaXEkKP9jCiHhm-Is7fGg/edit?tab=t.0)
* [API](https://api.laboratoriodetesting.com/api-docs/)


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
    + e2e
      + api                               | Tests to validate the login and signup api 
      + auth                              | Tests to validate the login and signup ui
      + cart                              | Tests to validate the add to cart behaviors
      + checkyout                         | Tests to validate the checkout behaviors
      + favorites                         | Tests to validate the favorites behaviors
    + fixtures                            | .json files to store all isolated data required to execute the tests 
    + support                             | Contains elements, commands and  
        + commands                        | Custom commands that simulate the user interactions                      
        + elements                        | Defined constants that include the DOM locators
        + pages                           | Defined the commands and elements defined, fachade structure
        + utils                           | Defined the helpers required to validate the prices.
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


>Update date: 24072025
