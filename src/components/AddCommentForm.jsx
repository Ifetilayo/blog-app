import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";
import useUser from "../hooks/useUser";

function AddCommentForm({ articleId, onArticleUpdated }) {
  const [comment, setComment] = useState("");
  const { user } = useUser();
  const { user } = useUser();

  const postComment = async () => {
    const authToken = user && (await user.getIdToken());
    const headers = authToken ? { authToken } : {};
    const authToken = user && (await user.getIdToken());
    const headers = authToken ? { authToken } : {};
    await axios
      .post(
        `http://localhost:8000/api/articles/${articleId}/comments`,
        {
          text: comment,
        },
        { headers }
      )
      .then((response) => {
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setComment("");
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("Resource not found:", error.response.data);
        } else {
          console.error("An error occurred:", error);
        }
      });
  };

  return (
    <div id="add-comment-form">
      <h3>Add comment</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        cols={50}
        name="comment-box"
        id=""
      ></textarea>
      <button onClick={postComment}>Add comment</button>
    </div>
  );
}

export default AddCommentForm;
