# User Api Spec

## Register User

Endpoint: POST api/users

Request Body :

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "string",
    "email": "string"
  }
}
```

Response Body (Error) :

```json
{
  "errors": "Error message"
}
```

## Login User

Endpoint: POST api/users/login

Request Body :

```json
{
  "email": "string",
  "password": "string"
}
```

Response Body :

```json
{
  "data": {
    "username": "string",
    "email": "string",
    "token": "token"
  }
}
```

## Get User

Endpoint: GET api/users/{username}

Request Headers :

- Authorization: Bearer {token}

Response Body :

```json
{
  "data": {
    "username": "string",
    "email": "string"
  }
}
```

## Update User

Endpoint: PATCH api/users/{username}

Request Headers :

- Authorization: Bearer {token}

Request Body :

```json
{
  "username": "string",
  "password": "string"
}
```

Response Body :

```json
{
  "data": {
    "username": "string",
    "email": "string"
  }
}
```

## Logout User

Endpoint: DELETE api/users/{username}

Request Headers :

- Authorization: Bearer {token}

```json
{
  "data": true
}
```
