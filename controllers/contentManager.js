const db = require('./db')

function getLatestCarosel() {
    return [
        {
            url: "./img/hogwards.jpg",
            title: "Hogwards Legacy",
            releaseDate: "February 10, 2023"
        },
        {
            url: "./img/atomicHeart.jpg",
            title: "Atomic Heart",
            releaseDate: "February 21, 2023"
        },
        {
            url: "./img/forrest.jpg",
            title: "Son Of The Forest",
            releaseDate: "February 10, 2023"
        },
        {
            url: "./img/hogwards.jpg",
            title: "Hogwards Legacy",
            releaseDate: "February 23, 2023"
        }
    ]
}

function getPosts() {
    return [
        {
            title: "Hogwards Legacy Review",
            author: "admin",
            date: "date",
            imgURL: "./img/hogwards.jpg",
            description: "Hogwarts Legacy is an upcoming action role-playing video game set in the Wizarding World universe, developed by Avalanche Software and published by Warner Bros. Interactive Entertainment. The game is set in the late 1800s and players assume the role of a student at Hogwarts School of Witchcraft and Wizardry, exploring an open world, attending classes, and engaging in magic-based combat."
        
        },
        {
            title: "Atomic Heart Review",
            author: "admin",
            date: "date",
            imgURL: "./img/atomicHeart.jpg",
            description: "Atomic Heart is an upcoming first-person action role-playing video game developed and published by Russian studio Mundfish. The game is set in an alternate universe during the height of the Soviet Union's technological revolution, where players assume the role of a KGB agent tasked with investigating a mysterious facility."
        
        },
        {
            title: "Son Of The Forrest Review",
            author: "admin",
            date: "date",
            imgURL: "./img/forrest.jpg",
            description: "Sons of the Forest is an upcoming survival horror game developed and published by Endnight Games, the studio behind the popular game, The Forest. The game is a sequel to The Forest and is set in a remote wilderness area where players must survive against a range of terrifying enemies and supernatural forces."
        
        }
    ]
}

module.exports = { getLatestCarosel, getPosts }