module.exports = (app, db) => {
    app.post('/post', async (req, res) => {
        let post = new db.Post({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        })
        await post.save()
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err))
    })

    app.get('/posts', async (req, res) => {
        let postArray;
        await db.Post.find().exec()
            .then(data => postArray=data)
            .catch(err => res.status(400).json(err))
        
        let postsArray = new Array();
        let authorsArray = new Array();
        let retourArray = new Array();

        console.log(postArray);

        if (postArray.length > 0) {
            let listAuthorUsed = new Array();
            postArray.forEach(element => {
                let index = listAuthorUsed.findIndex(e => e == element.author)
                let currentAuthor = null
                if (index == -1) {
                    listAuthorUsed.push(element.author)
                    db.Author.find({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    }).then(data =>currentAuthor = data);
                    if (currentAuthor != null) {
                        let authorTmp = {
                            "type": "people",
                            "id": currentAuthor._id.toString(),
                            "attributes": {
                                "name": currentAuthor.lastName + " " + currentAuthor.firstName,
                                "age": 80,
                                "gender": "male"
                            }
                        }   
                        authorsArray.push(authorTmp)
                    }
                }

                let postTmp = {
                    "type": "articles",
                    "id": element._id.toString(),
                    "attributes": {
                        "title": element.title,
                        "body": element.content,
                        "created": "2014-05-22T14:56:28.000Z",
                        "updated": "2015-05-22T14:56:28.000Z"
                    },
                    "relationships": {
                        "author": {
                            "data": {
                                "id": element.author,
                                 "type": "people"
                                }
                        }
                    }
                }   
                postsArray.push(postTmp)
            });
        }
        
        let retour = {
            "data": postsArray,
            "included": authorsArray
        }

        console.log(retour)
        res.status(200).json(retour)


        // res.status(200).json(authors)
    })
}
