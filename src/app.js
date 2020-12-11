const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

function verifyId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid repository id' });
  }

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', verifyId)

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const indexOfRepo = repositories.findIndex(rep => rep.id === id);

  const { likes, title: titleOld, url: urlOld, techs: techsOld } = repositories[indexOfRepo];

  let repositoryChanged = {
    id,
    title: verifyValue(title, titleOld),
    url: verifyValue(url, urlOld),
    techs: verifyValue(techs, techsOld),
    likes
  }

  repositories[indexOfRepo] = repositoryChanged;

  response.json(repositories[indexOfRepo]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexOfRepo = repositories.findIndex(rep => rep.id === id);

  repositories.splice(indexOfRepo, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const indexOfRepo = repositories.findIndex(repo => repo.id === id);

  repositories[indexOfRepo].likes++;

  response.json(repositories[indexOfRepo]);
});

function verifyValue(value, oldValue) {
  let valueToreturn;

  if (value) {
    valueToreturn = value;
  } else {
    valueToreturn = oldValue;
  }

  return valueToreturn;
}

module.exports = app;
