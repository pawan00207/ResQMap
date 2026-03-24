import React from "react";
import axios from "axios";

function Vote({ resourceId }) {

  // Function to handle voting
  async function handleVote(type) {
    try {
      await axios.post("/api/vote", {
        user_id: 1,
        resource_id: resourceId,
        vote_type: type,
      });

      console.log("Vote submitted successfully");

    } catch (error) {
      console.log("Error submitting vote:", error);
    }
  }

  return (
    <div>

      {/* Like Button */}
      <button onClick={() => handleVote(1)}>
        👍 Like
      </button>

      {/* Dislike Button */}
      <button onClick={() => handleVote(-1)}>
        👎 Dislike
      </button>

    </div>
  );
}

export default Vote;