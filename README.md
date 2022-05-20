# Shoonya-Frontend
 Repository for Shoonya's Frontend
 
 # Installation
Recommended to use Docker.
The installation and setup instructions have been tested on the following platforms:

- Docker
- Docker-Compose
- Ubuntu 20.04

If you are using a different operating system, you will have to look at external resources (eg. StackOverflow) to correct any errors.

## Docker Installation

`cd` to the root folder .Once inside, build the docker containers:

```bash
docker-compose build
```

## Running the front-end
To run the containers:

```bash
docker-compose up
```
Press Ctrl+C in terminal to stop the containers.

## Setup the front-end without Docker
 `cd` to the frontend folder. Install all dependencies

```bash
npm install
```

## Running without Docker
Run the following command
```bash
npm start
```
This should start the frontend on `localhost:3000`
