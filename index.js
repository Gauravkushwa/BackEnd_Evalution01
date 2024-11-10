const express = require("express");
const fs = require('fs');
const path = require("path");

const server = express();
const PORT = 3000;

server.use(express.json());

server.get('/', (req, res) => {
    res.send("Welcome to Home Page!");
});

const getPosts = () => {
    const data = fs.readFileSync(path.join(__dirname, "DB.json"), 'utf-8');
    return JSON.parse(data);
}

const savePost = (posts) => {
    fs.writeFileSync(path.join(__dirname, 'DB.json'), JSON.stringify(posts, null, 2));
}

server.post('/posts', (req, res) => {
    const posts = getPosts();
    const newPost = { id: Date.now().toString(), ...req.body };
    posts.push(newPost);
    savePost(posts);
    res.status(201).json(newPost);
});

server.get('/posts', (req, res) => {
    const posts = getPosts();
    res.json(posts);
});

server.get('/posts/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
        return res.status(404).json({ message: "Post not found!" });
    }
    res.json(post);
});

server.put('/posts/:id', (req, res) => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found!" });
    }
    posts[postIndex] = { ...posts[postIndex], ...req.body };
    savePost(posts);
    res.json(posts[postIndex]);
});

server.delete('/posts/:id', (req, res) => {
    let posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found!" });
    }
    const deletedPost = posts.splice(postIndex, 1)[0];
    savePost(posts);
    res.json(deletedPost);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
