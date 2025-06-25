# Address API Spec

## Create Address

Endpoint: POST api/contacts/{contactId}/addresses

Request Headers :

- Authorization: Bearer {token}

Request Body :

```json
{
  "street": "string",
  "city": "string",
  "province": "string",
  "country": "string",
  "postalCode": "string"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "string",
    "city": "string",
    "province": "string",
    "country": "string",
    "postalCode": "string"
  }
}
```

## Get Address

Endpoint: GET api/contacts/{contactId}/addresses/{addressId}

Request Headers :

- Authorization: Bearer {token}

```json
{
  "data": {
    "id": 1,
    "street": "string",
    "city": "string",
    "province": "string",
    "country": "string",
    "postalCode": "string"
  }
}
```

## Update Address

Endpoint: PATCH api/contacts/{contactId}/addresses/{addressId}

Request Headers :

- Authorization: Bearer {token}

Request Body :

```json
{
  "street": "string",
  "city": "string",
  "province": "string",
  "country": "string",
  "postalCode": "string"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "street": "string",
    "city": "string",
    "province": "string",
    "country": "string",
    "postalCode": "string"
  }
}
```

## Remove Address

Endpoint: DELETE api/contacts/{contactId}/addresses/{addressId}

Request Headers :

- Authorization: Bearer {token}

Response Body :

```json
{
  "data": true
}
```

## List Addresses

Endpoint: GET api/contacts/{contactId}/addresses

Request Headers :

- Authorization: Bearer {token}

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "street": "string",
      "city": "string",
      "province": "string",
      "country": "string",
      "postalCode": "string"
    },
    {
      "id": 2,
      "street": "string",
      "city": "string",
      "province": "string",
      "country": "string",
      "postalCode": "string"
    }
  ]
}
```
