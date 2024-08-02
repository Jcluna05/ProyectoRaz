const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/sparql', async (req, res) => {
  const query = req.body.query;
  const endpoint = 'YOUR_SPARQL_ENDPOINT'; // Reemplaza con tu endpoint SPARQL

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/sparql-results+json',
      },
      body: query,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post('/details', async (req, res) => {
  const documentId = req.body.documentId;
  const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX vivo: <http://vivoweb.org/ontology/core#>
    SELECT ?title ?authorName ?year ?abstract WHERE {
      <${documentId}> schema:name ?title ;
                     vivo:relatedBy ?authorship ;
                     schema:datePublished ?year ;
                     schema:description ?abstract .
      ?authorship vivo:relates ?author .
      ?author schema:name ?authorName .
    }`;

  const endpoint = 'YOUR_SPARQL_ENDPOINT'; // Reemplaza con tu endpoint SPARQL

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/sparql-results+json',
      },
      body: query,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
