import { useState, useEffect } from "react";
import axios from "axios";
import Article from "./components/Article";

function App() {
  const [articles, setArticles] = useState([]);
  const [subreddit, setSubreddit] = useState("javascript");

  const api = { url: `https://www.reddit.com/r/${subreddit}.json` };
  const canceltokenSource = axios.CancelToken.source();
  const fetshData = async () => {
    try {
      const response = await axios.get(api.url, canceltokenSource.token);
      const data = response.data;
      if (data) {
        setArticles(data.data.children);
        console.log(data.data.children);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetching data aborted");
      } else {
        console.log("error occured");
      }

      setArticles([]);
    }
  };

  useEffect(() => {
    fetshData();
    return () => canceltokenSource.cancel();
  }, [subreddit]);

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          className="input"
          value={subreddit}
          onChange={e => setSubreddit(e.target.value)}
        />
      </header>
      <div className="articles">
        {articles &&
          articles.map(article => (
            <Article article={article.data} key={article.data.id} />
          ))}
      </div>
    </div>
  );
}

export default App;
