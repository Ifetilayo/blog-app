import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";

function AddCommentForm({ articleId, onArticleUpdated }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const { user } = useUser();

  const postComment = async () => {
    const authToken = user && (await user.getIdToken());
    const headers = authToken ? { authToken } : {};
    await axios
      .post(
        `http://localhost:8000/api/articles/${articleId}/comments`,
        {
          postedBy: name,
          text: comment,
        },
        { headers }
      )
      .then((response) => {
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setComment("");
        setName("");
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
      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          cols={50}
          name=""
          id=""
        ></textarea>
      </label>
      <button onClick={postComment}>Add comment</button>
    </div>
  );
}

export default AddCommentForm;
