const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();

app.use(express.json())
app.use(cors())

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andriambololomananabrondone@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = (subject, emailContent, callback) => {
  // Options de l'e-mail
  const mailOptions = {
    from: 'no-reply@gmail.com',
    to: 'andry.brondone@gmail.com',
    subject: subject,
    html: emailContent
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info.response);
    }
  });
};

app.post('/api/send-email', (req, res) => {
  const { name, email, subject, content } = req.body;

  // Construction du contenu de l'e-mail en HTML
  const emailContent = `
    <div>
      <h2>Nom : ${name}</h2>
      <h3>Adresse e-mail ${email}</h3>
      <p style="font-size: 17px; max-width: 850px">${content}</p>
    </div>
  `;

  // Envoyer l'e-mail et gérer la réponse
  sendEmail(subject, emailContent, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'error network' });
    } else {
      res.send('E-mail envoyé avec succès');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running`));
