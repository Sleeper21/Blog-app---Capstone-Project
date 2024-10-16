import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express();
//Adding environment variables for developping (local) and for deploying (render)
const port = process.env.PORT || 3000;
const APIurl = process.env.NODE_ENV === 'production' 
  ? `${process.env.RENDER_EXTERNAL_URL}` // URL em produção (Render)
  : "http://localhost:4000";        // URL em desenvolvimento (local)

app.use(express.static("public"));

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// New Post page route
app.get("/newPost", (req, res) => {
    res.render("inputs.ejs")
})

// Home Page
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(APIurl + "/")
        res.render("index.ejs", {posts: response.data})

    } catch (error) {
        res.status(500).json({message: "Error getting the content."})
    }
})
// New post api route
app.post("/new", async (req, res) => {
    try {
        const response = await axios.post(APIurl + "/publish", req.body)
        //console.log(req.body);        
        res.redirect("/")        
    } catch (error) {
        res.status(500).json({message: "Error publishing the post."})
        console.log(error.message)
    }
})
// Get the Post from id and render inputs.ejs to edit
app.get("/edit/:id", async (req, res) => {
    try {
        const response = await axios.get(APIurl + "/edit/" + req.params.id)        
        res.render("inputs.ejs", { post: response.data}
        )
    } catch (error) {
        res.status(500).json({message: "Error opening the post."})
        console.log(error.message)
    }
})
// Patch one parameter of a post and publish the edited post
app.post("/edit/:id/submit", async (req, res) => {
    try {
        const response = await axios.patch(APIurl + "/edit/" + req.params.id + "/publish", req.body)
        res.redirect("/")
    } catch (error) {
        res.status(500).json({message: "Error updating the post."})
        console.log(error.message)
    }
})
//Delete a post
app.get("/delete/:id", async (req, res) => {
    try {
        const response = await axios.delete(APIurl + "/delete/" + req.params.id)        
        res.redirect("/")

    } catch (error) {
        res.status(500).json({message: "Error deleting the post."})
        console.log(error.message)
    }    
})
// Get post Id to comment
app.get("/comment/:id", async (req, res) => {
    const response = await axios.get(APIurl + "/comment/" + req.params.id)
    const postToComment = response.data

    res.render("comment.ejs", { post: postToComment })
})
//Post new comment
app.post("/comment/new/:id", async (req, res) => {
    const response = await axios.post(APIurl + "/comment/new/" + req.params.id + "/submit", req.body)
    res.redirect("/")
})
//View all comments
app.get("/view/:id/comments", async (req, res) => {
    try {
        const response = await axios.get(APIurl + "/view/" + req.params.id)
        res.render("read_comments.ejs", { post: response.data })
    } catch (error) {
        res.status(500).json({message: "Error getting the comments."})
    }
})



//Port
app.listen(port, () =>{
    console.log("Server running at http://localhost:" + port);
})