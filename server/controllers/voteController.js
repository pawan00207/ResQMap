const db = require("../db");

exports.voteResource = async (req, res) => {
  const { user_id, resource_id, vote_type } = req.body;

  try {
    const existing = await db.query(
      "SELECT * FROM votes WHERE user_id=$1 AND resource_id=$2",
      [user_id, resource_id]
    );

    if (existing.rows.length > 0) {
      await db.query(
        "UPDATE votes SET vote_type=$1 WHERE user_id=$2 AND resource_id=$3",
        [vote_type, user_id, resource_id]
      );
    } else {
      await db.query(
        "INSERT INTO votes(user_id, resource_id, vote_type) VALUES($1,$2,$3)",
        [user_id, resource_id, vote_type]
      );
    }

    res.json({ message: "Vote recorded" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
