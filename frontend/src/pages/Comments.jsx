

import { useEffect, useState } from "react";
import axios from "axios";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/comments")
      .then((res) => setComments(res.data))
      .catch(() => alert("Failed to load comments"));
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/comments", { text, referenceType: "dashboard" });
      setComments([res.data, ...comments]);
      setText("");
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Your Comments</h2>

      <div className="mb-4">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          onClick={handlePost}
          disabled={loading}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>

      <div>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b py-2">
              <p className="text-sm text-gray-700">{comment.text}</p>
              <p className="text-xs text-gray-400">Type: {comment.referenceType}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
