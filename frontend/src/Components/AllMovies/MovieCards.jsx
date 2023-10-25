import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/esm/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './MovieCards.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useEffect } from 'react';



function MovieCards() {

    const [movies, setMovies] = useState([]);
    const [likes, setLikes] = useState([]);
    
    useEffect(() => {
        Promise.all(
          [
            fetch("http://localhost:3002/movies"),
            fetch('http://localhost:3002/get/1/movies/getArray/-1')
          ]
        ).then(([resMovies, resLikes]) => {
           return Promise.all([resMovies.json(), resLikes.json()])
        }).then(([dataMovies, dataLikes]) => {
          setMovies(dataMovies);
          setLikes(dataLikes);
        })
    }, []);

    var likesArray = [];
    likes.forEach(item => {
      likesArray.push(item.movieID)
    })

    function likeMovie(movie){


      var id = movie.movieID;

      console.log(id)
  
      // replace 1 with userID of person logged on
      var url = `http://localhost:3002/get/1/movies/add/${id}`;
  
      fetch(url)
          .then((res) => {
              return res.json()
          })
          .then((data) => {
              console.log(data);
          })
          .catch((error) => {
              console.log(error);
          });
    }

    return (
        <Row xs={1} md={7}>
          {Array.from({ length: movies.length }).map((_, idx) => (
            <Col key={idx} style={{display: "inline-block", width: 100}} className="mx-4 my-2">
              <Card>
                {/* after a user likes an item, change it to a solid heart and make a post request to the server to add to liked list */}
                <Button className='likeButton' onClick={() => likeMovie(movies[idx])}>{ likesArray.includes(idx) ? "♥" : "♡" }</Button>
                <OverlayTrigger trigger='hover' placement="auto" overlay={
                        <Popover id="popover-basic">
                        <Popover.Header as="h3">{movies[idx].title}</Popover.Header>
                        <Popover.Header as="p">{movies[idx].director}</Popover.Header>
                        <Popover.Body>
                            {movies[idx].description}
                        </Popover.Body>
                        </Popover>
                }>
                  <Card.Img variant="top" src={movies[idx].coverImg} style={{width: 100, height: 150}} className='itemImage'/>
                </OverlayTrigger>
              </Card>
            </Col>
          ))}
        </Row>
      );
}

export default MovieCards
