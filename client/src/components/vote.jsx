import axios from "axios";

const Vote = ({ resourceId }) => {
  const handleVote = async (type) => {
    await axios.post("/api/vote", {
      user_id: 1,
      resource_id: resourceId,
      vote_type: type,
    });
  };

  return (
    <div>
      <button onClick={() => handleVote(1)}>👍</button>
      <button onClick={() => handleVote(-1)}>👎</button>
    </div>
  );
};

export default Vote;
