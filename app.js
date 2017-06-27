//SETUP
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride  = require("method-override"),
    sanitizer   = require("express-sanitizer");
    
mongoose.connect('mongodb://localhost/restfulblog');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema = new mongoose.Schema({
    title:      String, 
    content:    String, 
    image:      String, 
    created:    {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//     {
//         title: "Panda",
//         content: "panda is cute",
//         image: "https://www.pandasinternational.org/wptemp/wp-content/uploads/2012/10/slider1.jpg"
//     },
//     function(err, created) {
//         if (err)
//             console.log("failed to create");
//         else
//             console.log(created);
// });

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs) {
        if (err)
            res.redirect("/blogs");
        else
            res.render("index.ejs", {blogs: blogs});
    });
});

app.post("/blogs", function(req, res){
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.create(req.body.blog, function(err, created){
        if (err)
            res.redirect("/blogs/new");
        else
            res.redirect("/blogs");
    })
});

app.get("/blogs/new", function(req, res){
    res.render("new.ejs"); 
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (err)
            res.send("blog not found");
        else
            res.render("show.ejs", {blog: blog});
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if (err)
            res.send("update failed");
        else
            res.redirect("/blogs/" + req.params.id);
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err)
            res.send("deleting failed");
        else
            res.redirect("/blogs/");
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if (err)
            res.send("blog not found");
        else
            res.render("edit.ejs", {blog: blog});
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER STARTED!");
})