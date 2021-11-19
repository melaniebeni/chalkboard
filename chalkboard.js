const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (request, response) => {
    response.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
