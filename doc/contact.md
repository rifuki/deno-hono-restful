# Contact API Spec

## Create Contact

Endpoint: POST api/contacts

Request Headers :

- Authorization: Bearer {token}

Request Body :

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

Response Body :

```json
{
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

## Get Contact

Endpoint: GET api/contacts/{contactId}

Request Headers:

- Authorization: Bearer ${token}

Response Body :

```json
{
  "data": {
    "id": 0,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

## Update Contact

Endpoint: PATCH api/contacts/{contactId}

Request Headers :

- Authorization: Bearer {token}

Request Body :

```json
{
  "firstName": 0,
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

Response Body :

```json
{
  "data": {
    "id": 0,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

## Remove Contact

Endpoint: DELETE api/contacts/{contactId}

Request Headers :

- Authorization: Bearer {token}

Response Body :

```json
{
  "data": true
}
```

## Search Contact

Endpoint: GET api/contacts

Request Headers :

- Authorization: Bearer {token}

Query Parameters :

- name: string
- email: string
- phone: string
- page: number, default is 1
- size: number, default is 10

Response Body :

```json
{
  "data": [
    {
      "id": 0,
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    },
    {
      "id": 1,
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "size": 100
  }
}
```
