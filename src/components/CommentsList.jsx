import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

function CommentsList({ comments = [] }) {
  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div className="comment" key={`${comment}-${uuidv4()}`}>
          <h4>{comment.postedBy} </h4>
          <p>{comment.text}</p>
        </div>
      ))}
    </>
  );
}

// CommentsList.defaultProps = {
//   comments: [],
// };

export default CommentsList;
