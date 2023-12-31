/*
    index.js
*/

import supabase from './Config/db.js'
import express from 'express'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import cors from 'cors'

dotenv.config( { path : '.env' } );

const connection = await mysql.createConnection(process.env.DATABASE_URL)

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  // console.log('Connected to PlanetScale!');
});

// ------------------- Set up express server

const app = express()

// Needed for express POST requests to parse a JSON req.body
app.use(express.json());

app.options(cors());
app.use(cors())

// Not sure what this is needed for yet lol
app.use(express.urlencoded({ extended: false}));

// ------------------- Endpoints

// generalized search endpoint for all categories
app.get('/search/:category/:letters', async (req, res) => {
  let { category, letters } = req.params;

  category = category.charAt(0).toUpperCase() + category.slice(1);

  try {
      let response;

      if (category === 'Users') {
          response = await supabase
              .from('Users')
              .select('*')
              .ilike('username', `%${letters}%`);
      } else if (category === 'Books') {
          response = await supabase
              .from('Books')
              .select('*')
              .ilike('title', `%${letters}%`);
      } else {
          response = await supabase
              .from(category)
              .select('*')
              .ilike('title', `%${letters}%`);
      }

      if (response.error) {
          throw response.error;
      }

      res.send(response.data);
      console.log(response.data);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

// ------- search
app.get('/home/search/:letters', async (req, res) => {

	const letters = req.params.letters
  
	console.log("Made it here")
	const query = `SELECT * FROM movies WHERE title LIKE '%${letters}%' LIMIT 30;`;
	try {
	  const [rows] = await connection.query(query);
	  console.log(rows);
	  res.send(rows);
	} catch (err) {
	  console.log(err)
	}
  })

// ------------- get all

app.get('/Books/:pageNumber', async (req, res) => {

  const pageNumber = req.params.pageNumber;

  // already switched to supabase
    try {
      let { data: Books, error } = await supabase
      .from('Books')
      .select('*')
      .range((pageNumber - 1) * 23, pageNumber * 23)
      .order('id', { ascending: true })
      // console.log(Books);
      res.send(Books);
    } catch (err) {
      // console.log(err)
    }
})

app.get('/Movies/:pageNumber', async (req, res) => {

  const pageNumber = req.params.pageNumber;

  // already switched to supabase
    try {
      let { data: Movies, error } = await supabase
      .from('Movies')
      .select('*')
      .range((pageNumber - 1) * 23, pageNumber * 23)
      .order('id', { ascending: true })

      // console.log(Movies);
      res.send(Movies);
    } catch (err) {
      // console.log(err)
    }
})
app.get('/VideoGames/:pageNumber', async (req, res) => {

  const pageNumber = req.params.pageNumber;

  // already switched to supabase
    try {
      let { data: VideoGames, error } = await supabase
      .from('VideoGames')
      .select('*')
      .range((pageNumber - 1) * 23, pageNumber * 23)
      .order('id', { ascending: true })
      
      // console.log(VideoGames);
      res.send(VideoGames);
    } catch (err) {
      // console.log(err)
    }
})

// ------------ liked books
app.get('/getLikedBooks/:uid', async (req, res) => {

  const uid = req.params.uid

  console.log(uid)

  try {
    let { data: Books, error } = await supabase
    .from('likedBooks')
    .select('*, Books( * )')
    .eq('uid', uid)

    res.send(Books);
  } catch (err) {
    // console.log(err)
  }
})
app.post('/removeLikedBooks', async (req, res) => {

	const uid = req.body.uid;
	const itemId = req.body.itemId;

	console.log(`Removing book ${itemId}`)

	try {
		let { data: Books, error } = await supabase
		.from('likedBooks')
		.delete()
		.eq('uid', uid)
		.eq('itemId', itemId)

		res.send(Books);
	} catch (err) {
		console.log(err)
	}
})
app.post('/addLikedBooks', async (req, res) => {

	const uid = req.body.uid;
	const itemId = req.body.itemId;

	console.log(`Adding book ${itemId}`)

	try {
		let { data: Books, error } = await supabase
		.from('likedBooks')
		.insert([
			{ 'uid': uid, 'itemId': itemId },
		])
		.select()

	} catch (err) {
		console.log(err)
	}
})

// ------------ liked movies
app.get('/getLikedMovies/:uid', async (req, res) => {

	const uid = req.params.uid

	console.log(uid)
  
	try {
	  let { data: Movies, error } = await supabase
	  .from('likedMovies')
	  .select('*, Movies( * )')
	  .eq('uid', uid)

	  console.log(Movies)
  
	  res.send(Movies);
	} catch (err) {
	  console.log(err)
	}
})
app.post('/removeLikedMovies', async (req, res) => {

  const uid = req.body.uid;
  const itemId = req.body.itemId;

  console.log(`Removing movie ${itemId}`)

  try {
    let { data: Movie, error } = await supabase
    .from('likedMovies')
    .delete()
    .eq('uid', uid)
    .eq('itemId', itemId)

  } catch (err) {
    console.log(err)
  }
})
app.post('/addLikedMovies', async (req, res) => {

	const uid = req.body.uid;
	const itemId = req.body.itemId;

	console.log(`Adding Movie ${itemId}`)

	try {
		let { data: Movies, error } = await supabase
		.from('likedMovies')
		.insert([
			{ 'uid': uid, 'itemId': itemId },
		])
		.select()

	} catch (err) {
		console.log(err)
	}
})

// ------------ liked videogames
app.get('/getLikedVideoGames/:uid', async (req, res) => {

	const uid = req.params.uid

	console.log(uid)
  
	try {
	  let { data: VideoGames, error } = await supabase
	  .from('likedVideoGames')
	  .select('*, VideoGames( * )')
	  .eq('uid', uid)

	  console.log(VideoGames)
  
	  res.send(VideoGames);
	} catch (err) {
	  console.log(err)
	}
})
app.post('/removeLikedVideoGames', async (req, res) => {

	const uid = req.body.uid;
	const itemId = req.body.itemId;
  
	console.log(`Removing Videogame ${itemId}`)
  
	try {
	  let { data: VideoGames, error } = await supabase
	  .from('likedVideoGames')
	  .delete()
	  .eq('uid', uid)
	  .eq('itemId', itemId)
  
	} catch (err) {
	  console.log(err)
	}
  })
app.post('/addLikedVideoGames', async (req, res) => {

	const uid = req.body.uid;
	const itemId = req.body.itemId;

	console.log(`Adding Video Game ${itemId}`)

	try {
		let { data: VideoGames, error } = await supabase
		.from('likedVideoGames')
		.insert([
			{ 'uid': uid, 'itemId': itemId },
		])
		.select()

	} catch (err) {
		console.log(err)
	}
})


// Get the method from the library
app.get('/get/:userID/:library/:action/:itemID', async (req,res) => {
  // get the element from end point
  const userID = req.params.userID;
  const library = req.params.library;
  const action = req.params.action;
  const itemID = req.params.itemID;

  // Base on different action, we will deal with different library
  if (action == "getArray") {
    if (userID == -1 && itemID == -1){
      try {
        const query = 'SELECT * FROM ' + library + ';';
        const [rows] = await connection.query(query);
        // console.log("inserver ", rows);
        res.status(200).send(rows);
      } catch (err) {
        console.error(err);
      }
    } else if (userID == -1 && itemID >= 0) {
      try {
        let libraryID;
        if (library == "books") {
          libraryID = "bookID"
        } else if (library == "movies") {
          libraryID = "movieID"
        } else if (library == "videoGames") {
          libraryID = "videoGameID"
        }

        const query = 'SELECT * FROM ' + library + ' WHERE ' + libraryID + '= ' + itemID + ';';
        const [rows] = await connection.query(query, [itemID]);

        // probably change this error message into something more UI friendly later
        if (!rows[0]){
          return res.json({msg: "Couldn't find that book."})
        }
        res.status(200).json(rows[0]);
      } catch (err) {
        console.error(err);
      }
    } else if (userID >= 0 && itemID == -1) {
      try {
        let likedLibrary;
        let libraryAttr;
        if (library == "books") {
          likedLibrary = "likedBooks";
          libraryAttr = "bookID";
        } else if (library == "movies") {
          likedLibrary = "likedMovies";
          libraryAttr = "movieID";
        } else if (library == "videoGames") {
          likedLibrary = "likedVideoGames";
          libraryAttr = "videoGameID";
        }

        const query = 'SELECT * ' +
                      'FROM ' + library + ' JOIN ' + likedLibrary + ' ' +
                      'ON ' + library + '.' + libraryAttr + ' = ' + likedLibrary + '.' + libraryAttr + ' ' +
                      'WHERE userID = ' + userID + ';';
        // console.log(query);
        const [rows] = await connection.query(query);

        // probably change this error message into something more UI friendly later
        if (!rows[0]){
          return res.json({msg: "Couldn't find that book."})
        }
        res.status(200).json(rows);
      } catch (err) {
        console.error(err);
      }
    }
  } else if (action == "add") {
    let addLibrary;
    let libraryAttr;
    try {
      if (library == "books") {
        addLibrary = "likedBooks";
        libraryAttr = "bookID";
      } else if (library == "movies") {
        addLibrary = "likedMovies";
        libraryAttr = "movieID";
      } else if (library == "videoGames") {
        addLibrary = "likedVideoGames";
        libraryAttr = "videoGameID"
      }
      const query = 'INSERT INTO ' + addLibrary + ' ( userID, ' +  libraryAttr + ' ) VALUES ( ' + userID + ', ' + itemID + ' );';
      await connection.query(query)
    } catch (err) {
      console.error(err);
    }
  } else if (action == "delete") {
    let addLibrary;
    let libraryAttr;
    try {
      if (library == "books") {
        addLibrary = "likedBooks";
        libraryAttr = "bookID";
      } else if (library == "movies") {
        addLibrary = "likedMovies";
        libraryAttr = "movieID";
      } else if (library == "videoGames") {
        addLibrary = "likedVideoGames";
        libraryAttr = "videoGameID"
      }
      const query = 'DELETE FROM ' + addLibrary + ' WHERE ' + libraryAttr + '= ' + itemID + ' ;';
      await connection.query(query)
    } catch (err) {
      console.error(err);
    }
  }
})

// SharedList.jsx: get the username base on UserID
app.get('/username/:userID', async (req, res) => {
  console.log("fetching username");
  const userID = req.params.userID;
  try {
    let { data: userName, error } = await supabase
    .from('Users').select('username')
    .eq('id', userID)
    res.send(userName);
  } catch (err) {
    // console.log(err)
  }
})

// SharedList.jsx: get all lists
app.get("/getAllLists", async (req, res) => {
  console.log("fetching all lists");
  try {
    let { data: Lists, error } = await supabase
    .from('AccessLists').select('tableID')
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: get the accessed lists for that user
app.get("/getAccessedLists/:userName", async (req, res) => {
  console.log("fetching accessed lists");
  const userName = req.params.userName;
  try {
    let { data: Lists, error } = await supabase
    .from('AccessLists').select('tableID')
    .eq('userID', userName)
    res.send(Lists);
  } catch (error) {
    console.error(error);
  }
});

// SharedList.jsx: get the list from the table
app.get("/gettable/:listName", async (req, res) => {
  console.log("fetching table");
  const listName = req.params.listName;
  try {
    let { data: Lists, error } = await supabase
    .from("ListContains").select("category, id")
    .eq("Lists", listName)
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: add into shared list
app.post("/addToList/:curList", async (req, res) => {
  console.log("adding to list");
  const curList = req.params.curList;
  const categories = req.body.categories;
  const id = req.body.id;
  try {
    let { data: Lists, error } = await supabase
    .from("ListContains").insert([
      { 'Lists': curList, 'category': categories, 'id': id },
    ])
    .select("*")
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: delete from shared list
app.delete("/deleteFromList/:curList", async (req, res) => {
  console.log("deleting from list");
  const curList = req.params.curList;
  let deleteCategories = req.body.categories;
  const id = req.body.id;
  if (deleteCategories == "Video Games") deleteCategories = "VideoGames";
  try {
    const { error } = await supabase
    .from("ListContains").delete()
    .eq('Lists', curList)
    .eq('category', deleteCategories)
    .eq('id', id)
    res.send({category: deleteCategories, itemID: id});
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: get people who have access to the same list
app.get("/getSharedppl/:tableID", async (req, res) => {
  console.log("fetching Shared People");
  const tableID = req.params.tableID;
  try {
    const { data: Lists, error } = await supabase
    .from("AccessLists").select("userID")
    .eq('tableID', tableID)
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: adding user to the list
app.post("/addUser/:curList", async (req, res) => {
  console.log("adding user");
  const curList = req.params.curList;
  const userID = req.body.userID;
  try {
    const { data: Lists, error } = await supabase
    .from("AccessLists").insert([
      { 'userID': userID, 'tableID': curList },
    ])
    .select("*")
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: delete user from the list
app.delete("/deleteUser/:curList", async (req, res) => {
  console.log("deleting user");
  const curList = req.params.curList;
  const userID = req.body.userID;
  try {
    const { error } = await supabase
    .from("AccessLists").delete()
    .eq('userID', userID)
    .eq('tableID', curList)
    res.send({userID: userID});
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: delete the list
app.delete("/deleteList/:curList", async (req, res) => {
  console.log("deleting list");
  const curList = req.params.curList;
  try {
    const { error } = await supabase
    .from("AccessLists").delete()
    .eq('tableID', curList)
    const { error2 } = await supabase
    .from("ListContains").delete()
    .eq('Lists', curList)
    res.send("delete Successful");
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: fetch book Object
app.get("/getObject/Books/:userList", async (req, res) => {
  console.log("fetching book object");
  try {
    let { data, error } = await supabase
    .rpc('getBooksObject', {userlist: req.params.userList})
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: fetch movie Object
app.get("/getObject/Movies/:userList", async (req, res) => {
  console.log("fetching movie object");
  try {
    let { data, error } = await supabase
    .rpc('getMoviesObject', {userlist: req.params.userList})
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

// SharedList.jsx: fetch video gameObject
app.get("/getObject/VideoGames/:userList", async (req, res) => {
  console.log("fetching video game object");
  try {
    let { data, error } = await supabase
    .rpc('getVideoGamesObject', {userlist: req.params.userList})
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

// testing endpoint
app.get("/test", async (req, res) => {
  console.log("testing");
  try {
    let { data: Lists, error } = await supabase
    .from("Books").select('*')
    res.send(Lists);
  } catch (err) {
    console.error(err);
  }
});

// test to see if the connection is working
app.listen(3002, () => {
  console.log('App is running')
})
