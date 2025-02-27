

const API_URL = 'https://jsonplaceholder.typicode.com';

export async function getPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function createPost(postData) {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id, postData) {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    throw error;
  }
}

export async function searchPosts(query) {
  try {
    
    const response = await fetch(
      `${API_URL}/posts?title_like=${encodeURIComponent(query)}&body_like=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}