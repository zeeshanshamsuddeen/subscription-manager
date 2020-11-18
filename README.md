# Subscription Manager

A simple Subscription Manager using Node JS, Express JS and MySQL which runs in Docker containers. User can register with the service and can subscribe to predifined Plans.


## Table of Contents

- [APIs](#apis)
- [Quick Start](#quick-start)


## APIs
  
- `PUT: /user/<username>`

  Creates a user if the username does not exist in the service.
  
- `GET: /user/<username>`

  Retreive information regarding a particualr user.
  
- `POST: /subscription`

  `payload:
    {
    "user_name": "jay",
    "plan_id": "PRO_1M", 
    "start_date": "2020-03-03"
    }`
    
    Creates a new subscription for the user.
    
    `response:
    {
    "status": "SUCCESS", "amount": -200.0
    }`

- `GET: /subscription/<username>/<date>`

  Retrieve the valid subscription for the user for the specific date. If date is not present, retrieve all available subscriptions.
 
## Quick Start

- `docker-compose up` - To start the backend service and database in separate docker containers. 


