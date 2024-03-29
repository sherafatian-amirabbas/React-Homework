import { Link } from "react-router-dom";

const Header = () => {
  console.count("Header render");
  return (
    <div className="app-header">
      <h1>Comment App</h1>
      <ul>
        <li>
          <Link to="/comments">View comments</Link>
        </li>
        <li>
          <Link to="/addComment">Add comment</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
