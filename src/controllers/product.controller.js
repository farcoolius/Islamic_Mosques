const db = require("../config/database");

const { Parser } = require("json2csv");
const json2csvParser = new Parser();


// /**
//  * getRecords: Obtains all records
//  */
// getRecords: Obtains all records
exports.getRecord = async (req, res) => {
  try {
    const response = await db.query(
      'SELECT id, contributor, mosque_name, year_established, content, lat, lng, created_at FROM "tblRecord" ORDER BY id ASC'
    );

    // Return JSON (easier for frontend to use)
    res.status(200).json({ rows: response.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
};//



// /**
//  * Insert Comment/Review: Inserts user insert data of review into tblReview in the database
//  * @param {form} req - form body that contains user selected information
//  * @param {status} res - confirmation that comment has been added into the review table
//  */
exports.addRecord = async (req, res) => {
  try {
    let { contributor, mosque_name, year_established, content, lat, lng } = req.body;

    // Optional: basic server-side validation
    if (!mosque_name || mosque_name.trim().length === 0) {
      return res.status(400).json({ error: "mosque_name is required" });
    }
const yearValue =
      year_established === undefined || year_established === null || String(year_established).trim() === ""
        ? null
        : parseInt(year_established, 10);

const insertQuery = `
      INSERT INTO "tblRecord"(contributor, mosque_name, year_established, content, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, contributor, mosque_name, year_established, content, lat, lng, created_at
    `;

const values = [contributor, mosque_name, yearValue, content, lat, lng];

console.log(insertQuery, values);

const result = await db.query(insertQuery, values);

res.status(200).json({
      message: "record added into record table!",
      record: result.rows[0],
});
} catch (err) {
console.error(err);
res.status(500).json({ error: "Failed to add record" });
}
};
