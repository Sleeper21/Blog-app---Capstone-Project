import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CORS config -- only to allow Cross-Origin Resource Sharing to deploy on onrender
app.use(cors({
    origin: "https://blog-app-capstone-project-zzp5.onrender.com",
    credentials: true
}))

//All Posts
let posts = [
    {
        id: 1,
        title: "The Impact of Artificial Intelligence on the Job Market",
        content: "Artificial intelligence (AI) is revolutionizing the job market across various industries. While some jobs are being automated, new opportunities are also emerging. The key to navigating this new landscape is adapting and learning new skills. In this post, we explore which sectors are being most affected and what to expect for the future.",
        author: "Julia Mendes",
        country: "Brazil",
        date: "August 22, 2024",
        comments: [
            {
                id: 1,
                comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                author: "Dr. Smith",
                country: "USA",
                date: "October 02, 2024",
            },
        ]
    },
    {
        id: 2,
        title: "The Importance of Sleep for Mental Health",
        content: "Sleep plays a crucial role in our mental health. Studies show that sleep deprivation can lead to issues like anxiety, depression, and cognitive difficulties. Maintaining a good sleep routine is essential for overall well-being, improving mood, memory, and learning capabilities. In this article, we discuss tips for better sleep quality and the positive impact it can have on your life.",
        author: "Sofia Martins",
        country: "Portugal",
        date: "September 15, 2024",
        comments: [],
    },
    {
        id: 3,
        title: "Sustainable Travel: How to Reduce Your Ecological Footprint",
        content: "Traveling is one of the greatest sources of joy and learning, but it can have a significant environmental impact. This post discusses ways to travel more sustainably, such as choosing public transportation, staying in eco-friendly accommodations, and reducing plastic consumption while on the road. Small changes can make a big difference.",
        author: "Thomas Müller",
        country: "Germany",
        date: "September 30, 2024",
        comments: [
            {
                id: 1,
                comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                author: "Bruno Lopes",
                country: "Brasil",
                date: "October 02, 2024",
            },
        ]
    },
    {
        id: 4,
        title: "How to Organize Personal Finances with Ease",
        content: "Organizing your personal finances doesn’t have to be complicated. With a few simple practices, like creating a budget, tracking expenses, and setting financial goals, you can gain control over your money. This post offers a basic introduction on how to start, along with useful tools to make the process more efficient.",
        author: "Carlos Herrera",
        country: "Mexico",
        date: "October 3, 2024",
        comments: [
            {
                id: 1,
                comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                author: "Hai",
                country: "Japan",
                date: "October 02, 2024",
            },
        ]
    },
    {
        id: 5,
        title: "The Future of Gaming: Virtual Reality and Total Immersion",
        content: "With virtual reality (VR) becoming more advanced, the future of gaming promises increasingly immersive experiences. Companies are investing heavily in technologies that provide greater interactivity and physical sensations in games. This article explores the potential of VR in the gaming industry and how it could transform the way we play.",
        author: "Mei Lin",
        country: "China",
        date: "October 7, 2024",
        comments: [
            {
                id: 1,
                comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                author: "Harry K.",
                country: "France",
                date: "October 02, 2024",
            },
        ]
    },
];

let lastIdPosted = 5;
let commentsCount = 5;

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
        comments:[],
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
        comments: postToEdit.comments,
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
//Get post id to comment
app.get("/comment/:id", (req, res) => {
    const idSelected = parseInt(req.params.id); 
    const postToComment = posts.find((post) => post.id === idSelected);
    //console.log(postToEdit);
    
    if (!postToComment) return res.status(404).json({message: "Post content not found"})
    res.json(postToComment)
})
//Post new comment
app.post("/comment/new/:id/submit", (req, res) => {
    const postId = parseInt(req.params.id)

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit", 
    })

    const newComment = {
        id: commentsCount + 1,
        comment: req.body.comment,
        author: req.body.author,
        country: req.body.country,
        date: formattedDate,
    }
    //console.log(newComment);
    const index = posts.findIndex((post) => postId === post.id)
    const allPostComments = posts[index].comments
    //console.log(allPostComments);

    allPostComments.push(newComment)
    commentsCount++

    res.status(200).json({message: "Comment published."})
    console.log(allPostComments);    
})

//Get all comments from a post
app.get("/view/:id", (req, res) => {
    const selectedPost = posts.find((post) => post.id === parseInt(req.params.id))
    if (!selectedPost) return res.status(404).json({message: "Post comments not found."})
    
    res.json(selectedPost)
})

//Reset all changes  **********************************************
app.post("/api/reset", (req, res) => {
    posts = [
        {
            id: 1,
            title: "The Impact of Artificial Intelligence on the Job Market",
            content: "Artificial intelligence (AI) is revolutionizing the job market across various industries. While some jobs are being automated, new opportunities are also emerging. The key to navigating this new landscape is adapting and learning new skills. In this post, we explore which sectors are being most affected and what to expect for the future.",
            author: "Julia Mendes",
            country: "Brazil",
            date: "August 22, 2024",
            comments: [
                {
                    id: 1,
                    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                    author: "Dr. Smith",
                    country: "USA",
                    date: "October 02, 2024",
                },
            ]
        },
        {
            id: 2,
            title: "The Importance of Sleep for Mental Health",
            content: "Sleep plays a crucial role in our mental health. Studies show that sleep deprivation can lead to issues like anxiety, depression, and cognitive difficulties. Maintaining a good sleep routine is essential for overall well-being, improving mood, memory, and learning capabilities. In this article, we discuss tips for better sleep quality and the positive impact it can have on your life.",
            author: "Sofia Martins",
            country: "Portugal",
            date: "September 15, 2024",
            comments: [],
        },
        {
            id: 3,
            title: "Sustainable Travel: How to Reduce Your Ecological Footprint",
            content: "Traveling is one of the greatest sources of joy and learning, but it can have a significant environmental impact. This post discusses ways to travel more sustainably, such as choosing public transportation, staying in eco-friendly accommodations, and reducing plastic consumption while on the road. Small changes can make a big difference.",
            author: "Thomas Müller",
            country: "Germany",
            date: "September 30, 2024",
            comments: [
                {
                    id: 1,
                    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                    author: "Bruno Lopes",
                    country: "Brasil",
                    date: "October 02, 2024",
                },
            ]
        },
        {
            id: 4,
            title: "How to Organize Personal Finances with Ease",
            content: "Organizing your personal finances doesn’t have to be complicated. With a few simple practices, like creating a budget, tracking expenses, and setting financial goals, you can gain control over your money. This post offers a basic introduction on how to start, along with useful tools to make the process more efficient.",
            author: "Carlos Herrera",
            country: "Mexico",
            date: "October 3, 2024",
            comments: [
                {
                    id: 1,
                    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                    author: "Hai",
                    country: "Japan",
                    date: "October 02, 2024",
                },
            ]
        },
        {
            id: 5,
            title: "The Future of Gaming: Virtual Reality and Total Immersion",
            content: "With virtual reality (VR) becoming more advanced, the future of gaming promises increasingly immersive experiences. Companies are investing heavily in technologies that provide greater interactivity and physical sensations in games. This article explores the potential of VR in the gaming industry and how it could transform the way we play.",
            author: "Mei Lin",
            country: "China",
            date: "October 7, 2024",
            comments: [
                {
                    id: 1,
                    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sodales tortor. Phasellus convallis consequat efficitur. Nullam id quam nunc. Fusce sit amet turpis ante. Mauris in laoreet tortor. ",
                    author: "Harry K.",
                    country: "France",
                    date: "October 02, 2024",
                },
            ]
        },
    ];
    
    lastIdPosted = 5;  // reset countings
    commentsCount = 5;

    res.json(posts)
})

app.listen(port, () => {
    console.log("API is running at http://localhost:"+ port);
});