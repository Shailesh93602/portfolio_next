const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/contact', (req, res) => {
  const formData = req.body;
  console.log('Form Data:', formData);
  res.json({ message: 'Form submitted successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});