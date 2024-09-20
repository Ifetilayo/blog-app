import { useNavigate, useParams } from "react-router-dom";
import articles from "./article-content";
import NotFound from "./NotFound";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

function Article() {
  const [articleInfo, setArticeInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });

  const { user, isLoading } = useUser();
  const { articleId } = useParams();

  const { canUpvote = false } = articleInfo;
  const article = articles.find((article) => article.name === articleId);

  const upVote = async () => {
    const authToken = user && (await user.getIdToken());
    const headers = authToken ? { authToken } : {};

    await axios
      .put(`http://localhost:8000/api/articles/${articleId}/upvote`, null, {
        headers,
      })
      .then((response) => {
        setArticeInfo(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("Resource not found:", error.response.data);
        } else {
          console.error("An error occurred:", error);
        }
      });
  };

  useEffect(() => {
    const getArticleInfo = async () => {
      const authtoken = user && (await user.getIdToken());
      const headers = authtoken ? { authtoken } : {};

      if (articleId) {
        await axios
          .get(`http://localhost:8000/api/articles/${articleId}`, {
            headers: headers,
          })
          .then((response) => {
            setArticeInfo(response.data);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              console.error("Resource not found:", error.response.data);
            } else {
              console.error("An error occurred:", error);
            }
          });
      }
    };

    if (!isLoading) {
      getArticleInfo();
    }
  }, [articleId, isLoading, user]);

  const navigate = useNavigate();

  if (!article) {
    return <NotFound />;
  }

  return (
    <>
      <div className="upvotes-section">
        {user ? (
          <button onClick={upVote} disabled={!canUpvote}>
            Upvote
          </button>
        ) : (
          <button onClick={() => navigate("/login")}>Login to upvote</button>
        )}
        <h1>{article.title}</h1>
      </div>
      <p>This article has {articleInfo.upvotes} upvotes</p>
      {article.content.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {user ? (
        <AddCommentForm
          articleId={articleId}
          onArticleUpdated={(updatedArticle) => setArticeInfo(updatedArticle)}
        />
      ) : null}

      <CommentsList comments={articleInfo.comments} />
    </>
  );
}

export default Article;
