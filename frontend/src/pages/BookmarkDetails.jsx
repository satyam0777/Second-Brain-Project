


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";




const BookmarkDetail = () => {
  const { id } = useParams();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const response = await axiosInstance.get(`/bookmarks/${id}`);
        setBookmark(response.data.bookmark);
      } catch (error) {
        console.error("❌ Error fetching bookmark:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error("❌ Error fetching comments:", err);
      }
    };

    fetchBookmark();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post("/comments", {
        text: newComment,
        referenceId: id,
        referenceType: 'bookmark'
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Failed to post comment:", err);
    }
  };

  if (!bookmark) return <p>Bookmark not found or unauthorized.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{bookmark.title}</h2>
      <p><strong>Description:</strong> {bookmark.description}</p>
      <p><strong>URL:</strong> <a href={bookmark.url} target="_blank" rel="noreferrer">{bookmark.url}</a></p>
      <p><strong>Category:</strong> {bookmark.category}</p>
      <p><strong>Created At:</strong> {new Date(bookmark.createdAt).toLocaleString()}</p>

      <hr />

      <div>
        <h3>💬 Comments</h3>
        {comments.map((comment, idx) => (
          <div key={idx} style={{ background: "#f0f0f0", padding: "10px", margin: "10px 0", borderRadius: "8px" }}>
            <p>{comment.text}</p>
            <small>Posted on {new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))}

        <div style={{ marginTop: "10px" }}>
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          ></textarea>
          <button onClick={handleCommentSubmit} style={{ marginTop: "5px" }}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkDetail;
