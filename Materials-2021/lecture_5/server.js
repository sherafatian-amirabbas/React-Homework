/* eslint-env node */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const port = 8081;
const app = express();
const delay = 300;

const respondWithDelay = (respond) => {
  setTimeout(respond, delay);
};

app.use(cors());
app.use(bodyParser.json());

const initialComments = [
  { id: uuid.v4(), author: "react", text: "for components" },
  { id: uuid.v4(), author: "other tools", text: "for state" },
];

let currentComments = initialComments;

app.get("/comments", (req, res) => {
  respondWithDelay(() => {
    console.log("Responding with comments", currentComments);
    if (Math.random() > 0.6) {
      // Simulate service being intermittently unavailable
      res.status(503).send({ error: "Service temporarily unavailable" });
    } else {
      res.status(200).send(currentComments);
    }
  });
});

app.post("/comments", (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    respondWithDelay(() =>
      res.status(422).send({ error: "author and text must be specified" })
    );
  } else {
    const id = uuid.v4();
    const newComment = { id, author, text };
    currentComments = currentComments.concat(newComment);
    respondWithDelay(() => {
      if (Math.random() > 0.6) {
        res.status(503).send({ error: "Service temporarily unavailable" });
      } else {
        console.log("Added comment", newComment);
        res.status(201).send({ id });
      }
    });
  }
});

app.delete("/comments/:commentId", (req, res) => {
  const commentId = req.params.commentId;
  const commentIndex = currentComments.findIndex((el) => el.id === commentId);
  if (commentIndex >= 0) {
    respondWithDelay(() => {
      console.log("Deleted comment", currentComments[commentIndex]);
      currentComments = currentComments.filter((el) => el.id !== commentId);
      res.status(200).send({});
    });
  } else {
    respondWithDelay(() => {
      res.status(404).send({});
    });
  }
});

app.listen(port, () => {
  console.log(`${new Date()} Server is listening on port ${port}`);
});
