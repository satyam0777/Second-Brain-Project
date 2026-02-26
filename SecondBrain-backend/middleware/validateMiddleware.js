// Validation middleware for request data

export const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be less than 200 characters' });
  }
  
  if (content.length > 10000) {
    return res.status(400).json({ error: 'Content must be less than 10000 characters' });
  }
  
  next();
};

export const validateBookmark = (req, res, next) => {
  const { title, url } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (!url || url.trim().length === 0) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Basic URL validation
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlPattern.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be less than 200 characters' });
  }
  
  next();
};

export const validateComment = (req, res, next) => {
  const { text, content, referenceId } = req.body;
  const commentText = text || content;
  
  if (!commentText || commentText.trim().length === 0) {
    return res.status(400).json({ error: 'Comment text is required' });
  }
  
  if (!referenceId) {
    return res.status(400).json({ error: 'Reference ID is required' });
  }
  
  if (commentText.length > 1000) {
    return res.status(400).json({ error: 'Comment must be less than 1000 characters' });
  }
  
  next();
};

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!password || password.trim().length === 0) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  next();
};
