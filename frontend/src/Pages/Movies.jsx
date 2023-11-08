import React from "react";

import NavBar from "../Components/NavBar/NavBar";
import Grid from "../Components/AllGrid/Grid";

const Movies = () => {
    return (
        <div>
            <NavBar />
            <Grid list='movies'/>
        </div>

    );
}

export default Movies;