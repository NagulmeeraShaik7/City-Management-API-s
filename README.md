# City Management API's

**1. Add City API**

**Endpoint**

- URL: `/api/cities`
- Method:` POST`
- Description: Adds a new city to the collection.

**Request**

**Headers**

- `Content-Type: application/json`

{

"name": "New York",

"population": 1000000,

"country": "USA",

"latitude": 34.0522,

"longitude": -118.2437

}

**Response**

_Success_

- Status Code: `201 Created`
- Body : "City Successfully Created"

_Error_

- Status Code: `400 Bad Request`
- Reason: Missing required fields or invalid data.
- Body : "Please provide all required fields"

- Status Code: `500 Internal Server Error`
- Reason: "Failed to add city"
- Body: "Failed to add City"

**2.Get Cities API**

**Endpoint**

- URL: `/api/cities`
- Method: `GET`
- Description: Retrieves cities with support for pagination, filtering, sorting, searching, and projection.

**Query Parameters**

- page: Page number for pagination (default: 1).
- limit: Maximum number of cities per page (default: 10).
- filter: Filter cities based on specified criteria (JSON format).
- sort: Sort cities by a specified field and order (e.g., name ASC).
- search: Search for cities based on a search term.
- projection: Specify which fields to include or exclude (e.g., name,population)

**Response**

_Success_

- Status Code: `200 OK`
- Body: Array of cities matching the query parameters.
  json

[

{

    "id": 1,
    "name": "New York",
    "population": 1000000,
    "country": "USA",
    "latitude": 34.0522,
    "longitude": -118.2437

}

_// More cities..._

]

**Error**

- Status Code: `500 Internal Server Error`
- Reason: Failed to retrieve cities.
- Body:"Failed to retrieve cities"

**3. Update City API**

**Endpoint**

- URL: `/api/cities/:id`
- Method: `PUT`
- Description: Updates an existing city in the collection.

**URL Parameters**

- id: Identifier of the city to update.

**Request**

- Headers
  Content-Type: `application/json`

{

"name": "Hyderabad",

"population": 1500000,

"country": "India",

"latitude": 34.0522,

"longitude": -118.2437

}

**Response**

_Success_

- Status Code:` 200 OK`
- Body

{

"message": "City successfully updated",

"city":
{

    "id": 1,
    "name": "Hyderabad",
    "population": 1500000,
    "country": "India",
    "latitude": 34.0522,
    "longitude": -118.2437

}

}

**Error**

- Status Code: `400 Bad Request`

- Reason: Missing required fields or invalid data.

- Body

  _Please provide all required fields and city identifier_

- Status Code: `404 Not Found`

- Body: _City not found._

- Status Code: `500 Internal Server Error`

- Body: _Failed to update city._

**4.Delete City API**

**Endpoint**

- URL: `/api/cities/:id`
- Method: `DELETE`
- Description: Deletes a city from the collection.

_URL Parameters_

`id`: Identifier of the city to delete.

**Response**

_Success_

- Status Code: `200 OK`
- Body: "City successfully deleted"

**Error**

- Status Code: `400 Bad Request`

- Body: "City identifier is required"

- Status Code: `404 Not Found`

- Body: "City not found."

- Status Code: `500 Internal Server Error`

- Body: "Failed to delete city."

---

- For initializing project `npm init -y`

- For installing all packages `npm install`.
- If we want to individually install packages
  - Express: `npm install express --save`
  - Sqlite: `npm install sqlite --save`
  - Sqlite3: `npm install sqlite3 --save`
- For run the project:`node app.js`
