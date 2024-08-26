const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const databasePath = path.join(__dirname, "cities.db");

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    await database.run(`
            CREATE TABLE IF NOT EXISTS cities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                population INTEGER,
                country TEXT,
                latitude REAL,
                longitude REAL
            );`);

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//Add City API
app.post("/api/cities", async (request, response) => {
  const { name, population, country, latitude, longitude } = request.body;

  if (!name || !population || !country || !latitude || !longitude) {
    return response.status(400).send("Please provide all required fields");
  }

  try {
    // Parameterized query to insert values
    const query = `
      INSERT INTO cities (name, population, country, latitude, longitude)
      VALUES (?,?,?,?,?);
    `;

    // Run the query with the provided values
    await database.run(query, [
      name,
      parseInt(population, 10),
      country,
      parseFloat(latitude),
      parseFloat(longitude),
    ]);
    response.status(201).send("City Successfully Added");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      response.status(400).send("City with this name already exists");
    } else {
      console.error(error); // Log the error for debugging purposes
      response.status(500).send("Failed to add city");
    }
  }
});

// Get Cities API
app.get("/api/cities", async (request, response) => {
  const {
    page = 1,
    limit = 10,
    filter = "{}",
    sort = "name ASC",
    search = "",
    projection = "*",
  } = request.query;

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  // Validate and parse filter
  let filterCriteria = JSON.parse(filter);
  let filterClauses = [];
  let filterValues = [];

  for (const [key, value] of Object.entries(filterCriteria)) {
    filterClauses.push(`${key} = ?`);
    filterValues.push(value);
  }

  let filterSQL =
    filterClauses.length > 0 ? `WHERE ${filterClauses.join(" AND ")}` : "";

  // Search condition
  let searchSQL = search ? ` AND (name LIKE ?) ` : "";
  let searchValues = search ? [`%${search}%`] : [];

  // Sort condition
  let sortSQL = `ORDER BY ${sort}`;

  // Combine all query parts
  const query = `
    SELECT ${projection}
    FROM cities
    ${filterSQL}
    ${searchSQL}
    ${sortSQL}
    LIMIT ? OFFSET ?;
  `;

  // Append limit and offset values to the query parameters
  const values = [
    ...filterValues,
    ...searchValues,
    parseInt(limit, 10),
    offset,
  ];

  try {
    const cities = await database.all(query, values);
    response.json(cities);
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).send("Failed to retrieve cities");
  }
});

// Update City API
app.put("/api/cities/:id", async (request, response) => {
  const { id } = request.params; // City identifier (could be name or ID)
  const { name, population, country, latitude, longitude } = request.body;

  if (!id || !name || !population || !country || !latitude || !longitude) {
    return response
      .status(400)
      .send("Please provide all required fields and city identifier");
  }

  try {
    // Update the city with the given ID
    const query = `
      UPDATE cities
      SET name = ?, population = ?, country = ?, latitude = ?, longitude = ?
      WHERE id = ?;
    `;

    const result = await database.run(query, [
      name,
      parseInt(population, 10),
      country,
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(id, 10),
    ]);

    if (result.changes === 0) {
      return response.status(404).send("City not found");
    }

    // Retrieve the updated city
    const updatedCity = await database.get(
      "SELECT * FROM cities WHERE id = ?",
      [id]
    );

    response.status(200).json({
      message: "City successfully updated",
      city: updatedCity,
    });
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).send("Failed to update city");
  }
});

// Delete City API
app.delete("/api/cities/:id", async (request, response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).send("City identifier is required");
  }

  try {
    // Delete the city with the given ID
    const result = await database.run(
      `
      DELETE FROM cities
      WHERE id = ?;
    `,
      [id]
    );

    if (result.changes === 0) {
      // If no rows were affected, it means the city with the provided ID was not found
      return response.status(404).send("City not found");
    }

    response.status(200).send("City successfully deleted");
  } catch (error) {
    console.error("Database error:", error);
    response.status(500).send("Failed to delete city");
  }
});

module.exports = app;
