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

async function getPosts() {
    const result = await db.executeMYSQL("SELECT * FROM posts;")
    return result
}

async function getLast3Posts() {
    const result = await db.executeMYSQL("SELECT * FROM posts ORDER BY id DESC LIMIT 10;")
    return result
}

async function getPostById(id) {
    const result = (await db.executeMYSQL("SELECT * FROM posts WHERE id = ?;", [id]))[0]
    return result
}

module.exports = { getLatestCarosel, getPosts, getPostById, getLast3Posts }