import React, { useState } from 'react';
import './App.css';

// 模擬的用戶資料
const initialUsers = [
  { id: 1, username: 'john_doe', profilePic: 'https://via.placeholder.com/50' },
  { id: 2, username: 'jane_smith', profilePic: 'https://via.placeholder.com/50' },
];

// 帖子組件
const Post = ({ post, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(post.id, comment);
      setComment('');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img className="profile-pic" src={post.user.profilePic} alt={post.user.username} />
        <strong>{post.user.username}</strong>
      </div>
      <img className="post-image" src={post.image} alt="Post content" />
      <div className="post-description">
        <strong>{post.user.username}: </strong>{post.description}
      </div>
      <div className="post-comments">
        {post.comments.map((comment, idx) => (
          <div key={idx} className="comment">{comment}</div>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

// 新帖發佈組件
const NewPostForm = ({ onPostSubmit }) => {
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleImageChange = (e) => setImage(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image && description) {
      onPostSubmit({ image, description });
      setImage('');
      setDescription('');
    }
  };

  return (
    <div className="new-post-form">
      <h3>Create a new post</h3>
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={handleImageChange}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        required
      />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

// 登錄/註冊表單組件
const AuthForm = ({ onLogin, onRegister, existingUsers }) => {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (existingUsers.find(user => user.username === username)) {
        alert('Username already taken');
      } else {
        onRegister(username);
      }
    } else {
      const user = existingUsers.find(u => u.username === username);
      if (user) {
        onLogin(user); // 登錄成功後返回用戶資訊
      } else {
        alert('User not found');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
        required
      />
      <button onClick={handleSubmit}>{isRegistering ? 'Register' : 'Login'}</button>
      <p>
        {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
        <span onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

// 主應用程式組件
function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(initialUsers); // 儲存用戶

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleRegister = (username) => {
    const newUser = {
      id: Date.now(),
      username,
      profilePic: 'https://via.placeholder.com/50',
    };
    setUsers([...users, newUser]); // 新增用戶到用戶列表
    setUser(newUser); // 登錄新註冊的用戶
  };

  const handlePostSubmit = ({ image, description }) => {
    const newPost = {
      id: Date.now(),
      user,
      image,
      description,
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  return (
    <div className="App">
      <h1>Simple Social App (Like Instagram)</h1>
      
      {!user ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} existingUsers={users} />
      ) : (
        <div>
          <h2>Welcome, {user.username}</h2>
          <NewPostForm onPostSubmit={handlePostSubmit} />
          {posts.map(post => (
            <Post key={post.id} post={post} onAddComment={handleAddComment} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
