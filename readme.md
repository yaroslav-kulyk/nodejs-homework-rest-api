# Contacts API

## **Base URL**

> `https://{hostname}/api`

---

## **Users**

## Register - **`POST` /users/signup**

### Request:

- Url Params:
  No specific query parameters needed.

- Body:

```json
{
  "email": "macugy@thecarinformation.com",
  "password": "12345"
}
```

### Response:

- Status: **201**

- Body:

```json
{
  "user": {
    "email": "macugy@thecarinformation.com",
    "subscription": "starter"
  }
}
```

---

## Login - **`POST` /users/login**

### Request:

- Url Params:
  No specific query parameters needed.

- Body:

```json
{
  "email": "macugy@thecarinformation.com",
  "password": "12345"
}
```

### Response:

- Status: **200**

- Body:

```json
{
  "token": "token",
  "user": {
    "email": "macugy@thecarinformation.com",
    "subscription": "starter"
  }
}
```

---

## Logout - **`GET` /users/logout**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

### Response:

- Status: **204**

- Body:

---

## Verify account - **`GET` /users/verify/{verification_token}**

### Request:

- Url Params:
  No specific query parameters needed.

- Body:

### Response:

- Status: **200**

- Body:

```json
{
  "message": "Verification successful"
}
```

---

## Request verification - **`POST` /users/verify**

### Request:

- Url Params:
  No specific query parameters needed.

- Body:

```json
{
  "email": "macugy@thecarinformation.com"
}
```

### Response:

- Status: **200**

- Body:

```json
{
  "message": "Verification email sent"
}
```

---

## Get current user info - **`GET` /users/current**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

### Response:

- Status: **200**

- Body:

```json
{
  "user": {
    "email": "macugy@thecarinformation.com",
    "subscription": "starter"
  }
}
```

---

## Update subscription - **`PATCH` /users**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

```json
{
  "subscription": "pro"
}
```

### Response:

- Status: **200**

- Body:

```json
{
  "user": {
    "email": "macugy@thecarinformation.com",
    "subscription": "pro"
  }
}
```

---

## Upload avatar - **`PATCH` /users/avatars**

### Request:

- Url Params:
  No specific query parameters needed.

- Headers:
  Content-Type: multipart/form-data

- Authorization: Bearer {token}

- Body:
  field name: avatar

### Response:

- Status: **200**

- Body:

```json
{
  "avatarURL": "avatar URL"
}
```

---

## **Contacts**

## Add contact - **`POST` /contacts**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

```json
{
  "name": "John Doe",
  "email": "jsohn@mail.com",
  "phone": "(294) 777-5432"
}
```

### Response:

- Status: **201**

- Body:

```json
{
  "name": "John Doe",
  "email": "john@mail.com",
  "phone": "(294) 777-5432",
  "favorite": false,
  "owner": "{owner_id}",
  "_id": "{id}",
  "createdAt": "",
  "updatedAt": ""
}
```

---

## Get all contacts - **`GET` /contacts/**

### Request:

- Url Params:
  page, limit

- Authorization: Bearer {token}

- Body:

### Response:

- Status: **200**

- Body:

```json
[
  {
    "_id": "{id}",
    "name": "John Doe",
    "email": "john@mail.com",
    "phone": "(294) 777-5432",
    "favorite": false,
    "owner": "{owner_id}"
  },
  {
    "_id": "{id}",
    "name": "Jane Doe",
    "email": "jane@mail.com",
    "phone": "(294) 654-3213",
    "favorite": false,
    "owner": "{owner_id}"
  },
  ...
]
```

---

## Get contact by ID - **`GET` /contacts/{id}**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

### Response:

- Status: **200**

- Body:

```json
{
  "_id": "{id}",
  "name": "John Doe",
  "email": "john@mail.com",
  "phone": "(294) 777-5432",
  "favorite": false,
  "owner": "{owner_id}"
}
```

---

## Update contact by ID - **`PUT` /contacts/{id}**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

```json
{
  "name": "John Doe Update"
}
```

### Response:

- Status: **200**

- Body:

```json
{
  "_id": "{id}",
  "name": "John Doe Update",
  "email": "john@mail.com",
  "phone": "(294) 777-5432",
  "favorite": false,
  "owner": "{owner_id}"
}
```

---

## Update contact favorite - **`PATCH` contacts/{id}/favorite**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

```json
{
  "favorite": true
}
```

### Response:

- Status: **200**

- Body:

```json
{
  "_id": "{id}",
  "name": "John Doe Updated",
  "email": "john@mail.com",
  "phone": "(294) 777-5432",
  "favorite": true,
  "owner": "{owner_id}"
}
```

---

## Remove contact - **`DELETE` /contacts/{id}**

### Request:

- Url Params:
  No specific query parameters needed.

- Authorization: Bearer {token}

- Body:

### Response:

- Status: **200**

- Body:

```json
{
  "message": "contact deleted"
}
```
