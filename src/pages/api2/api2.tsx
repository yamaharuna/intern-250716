import { useState } from 'react'
import { Link } from 'react-router-dom'
import './api2.scss'

function Api2() {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawHtml, setRawHtml] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Fetch users from the API
      const response = await fetch('api/events.json');
      if (!response.ok) {
        throw new Error('Failed to fetch users data');
      }
      
      const data = await response.json();
      
      // Filter users based on the input (case insensitive)
      const filteredEvent = data.events.filter((event: any) => 
        event.title.toLowerCase().includes(username.toLowerCase())
      );
      
      setSearchResults(filteredEvent);
      
      // Create unsafe HTML that includes the raw user input - THIS IS INTENTIONALLY VULNERABLE
      // DON'T DO THIS IN PRODUCTION CODE!
      setRawHtml(`
        <div class="search-query">
          <h3>検索クエリ: ${username}</h3>
          <p>検索結果: ${filteredEvent.length}件</p>
        </div>
      `);
    } catch (err) {
      setError('データの取得中にエラーが発生しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page">
      <div className="header">
        <h1>イベント検索</h1>
      </div>

      <div className="main">
        <section className="demo-section">
          <h2>イベント名検索</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">イベント名:</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="ユーザー名を入力" 
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? '検索中...' : '検索'}
            </button>
          </form>
        </section>

        <section className="output-section">
          <h2>検索結果</h2>
          
          {error && <p className="error">{error}</p>}
          
          
          
          {searchResults && searchResults.length > 0 ? (
  <div className="event-results">
    <h3>イベント一覧:</h3>
    <table>
      <thead>
        <tr>
          <th>タイトル</th>
          <th>開催期間</th>
          <th>場所</th>
          <th>定員</th>
          <th>主催者</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((event: any) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>
              {new Date(event.startDate).toLocaleDateString()} ～<br />
              {new Date(event.endDate).toLocaleDateString()}
            </td>
            <td>{event.location}</td>
            <td>
              {event.currentParticipants}/{event.maxParticipants}
            </td>
            <td>{event.organizer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : searchResults && searchResults.length === 0 ? (
  <p>該当するイベントは見つかりませんでした。</p>
) : null}

          
        </section>

      </div>
      <div className="back-link">
        <Link to="/">ホームに戻る</Link>
      </div>
    </div>
  );
}

export default Api2
