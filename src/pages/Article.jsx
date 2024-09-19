import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFound from "./NotFound";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";

function Article() {
  const [articleInfo, setArticeInfo] = useState({ upvotes: 0, comments: [] });

  const { articleId } = useParams();
  const article = articles.find((article) => article.name === articleId);

  const getArticleInfo = useCallback(async () => {
    if (articleId) {
      await axios
        .get(`http://localhost:8000/api/articles/${articleId}`)
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
  }, [articleId]);

  const upVote = async () => {
    await axios
      .put(`http://localhost:8000/api/articles/${articleId}/upvote`, {})
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
    getArticleInfo();
  }, [getArticleInfo]);

  if (!article) {
    return <NotFound />;
  }

  return (
    <>
      <div className="upvotes-section">
        <h1>{article.title}</h1>
        <button onClick={upVote}>Upvote</button>
      </div>
      <p>This article has {articleInfo.upvotes} upvotes</p>
      {article.content.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <AddCommentForm
        articleId={articleId}
        onArticleUpdated={(updatedArticle) => setArticeInfo(updatedArticle)}
      />
      <CommentsList comments={articleInfo.comments} />
    </>
  );
}

export default Article;
