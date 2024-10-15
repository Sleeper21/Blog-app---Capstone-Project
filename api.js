import express from "express"
import bodyParser from "body-parser"

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//All Posts
let lastIdPosted = 5;
let posts = [
    {
        id: 1,
        title: "The Impact of Artificial Intelligence on the Job Market",
        content: "Artificial intelligence (AI) is revolutionizing the job market across various industries. While some jobs are being automated, new opportunities are also emerging. The key to navigating this new landscape is adapting and learning new skills. In this post, we explore which sectors are being most affected and what to expect for the future.",
        author: "Julia Mendes",
        country: "Brazil",
        date: "August 22, 2024",
        comments: 
            {
                id: 1,
                comment: "I Agree"
            }
    },
    {
        id: 2,
        title: "The Importance of Sleep for Mental Health",
        content: "Sleep plays a crucial role in our mental health. Studies show that sleep deprivation can lead to issues like anxiety, depression, and cognitive difficulties. Maintaining a good sleep routine is essential for overall well-being, improving mood, memory, and learning capabilities. In this article, we discuss tips for better sleep quality and the positive impact it can have on your life.",
        author: "Sofia Martins",
        country: "Portugal",
        date: "September 15, 2024",
    },
    {
        id: 3,
        title: "Sustainable Travel: How to Reduce Your Ecological Footprint",
        content: "Traveling is one of the greatest sources of joy and learning, but it can have a significant environmental impact. This post discusses ways to travel more sustainably, such as choosing public transportation, staying in eco-friendly accommodations, and reducing plastic consumption while on the road. Small changes can make a big difference.",
        author: "Thomas Müller",
        country: "Germany",
        date: "September 30, 2024",
    },
    {
        id: 4,
        title: "How to Organize Personal Finances with Ease",
        content: "Organizing your personal finances doesn’t have to be complicated. With a few simple practices, like creating a budget, tracking expenses, and setting financial goals, you can gain control over your money. This post offers a basic introduction on how to start, along with useful tools to make the process more efficient.",
        author: "Carlos Herrera",
        country: "Mexico",
        date: "October 3, 2024",
    },
    {
        id: 5,
        title: "The Future of Gaming: Virtual Reality and Total Immersion",
        content: "With virtual reality (VR) becoming more advanced, the future of gaming promises increasingly immersive experiences. Companies are investing heavily in technologies that provide greater interactivity and physical sensations in games. This article explores the potential of VR in the gaming industry and how it could transform the way we play.",
        author: "Mei Lin",
        country: "China",
        date: "October 7, 2024",
    },
];


// Get all posts
app.get("/", (req, res) => {
    res.json(posts)
})

// Get a post from id
app.get("/edit/:id", (req, res) => {
    const idSelected = parseInt(req.params.id); 
    const postToEdit = posts.find((post) => post.id === idSelected);
    //console.log(postToEdit);
    
    if (!postToEdit) return res.status(404).json({message: "Post content not found"})
    res.json(postToEdit)
})

// Add new Post
app.post("/publish", (req, res) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {  //Just to format the date
        year: "numeric",
        month: "long", // displays the full month word
        day: "2-digit", 
    })

    const newPost = {
        id: lastIdPosted + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        country: req.body.country,
        date: formattedDate,
    }
    posts.push(newPost)
    lastIdPosted ++

    res.json(posts)    
})

// Patch a post
app.patch("/edit/:id/publish", (req, res) => {
    const postId = parseInt(req.params.id)
    const postToEdit = posts.find((post) => post.id === postId)
    if (!postToEdit) return res.statur(404).json({ message: "Original post not found. Try again on a published post."})

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long", 
        day: "2-digit", 
    })

    const locationIndex = posts.findIndex((post) => post.id === postId)
    posts[locationIndex] = {
        id: postId,
        title: req.body.title || postToEdit.title,
        content: req.body.content || postToEdit.content,
        author: req.body.author || postToEdit.author,
        country: req.body.country || postToEdit.country,
        date: "Edited on: " + formattedDate,
    }
    res.json(posts)    
})
// Delete a post
app.delete("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id)
    const indexToDelete = posts.findIndex((post) => post.id === postId)

    posts.splice(indexToDelete, 1)
    res.status(200).json({message: "Post deleted."})
})


app.listen(port, () => {
    console.log("API is running at http://localhost:"+ port);
});