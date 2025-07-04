# User Api Spec

## Register User

Endpoint: POST api/users

Request Body :

```json
{
  "username": "string",
  "password": "string"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "string",
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
  "username": "string",
  "password": "string"
}
```

Response Body :

```json
{
  "data": {
    "username": "string",
    "token": "token"
  }
}
```

## Get User

Endpoint: GET api/users/@me

Request Headers :

- Authorization: Bearer {token}

Response Body :

```json
{
  "data": {
    "username": "string",
  }
}
```

## Update User

Endpoint: PATCH api/users/@me

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
  }
}
```

## Logout User

Endpoint: DELETE api/users/@me

Request Headers :

- Authorization: Bearer {token}

```json
{
  "data": true
}
```
