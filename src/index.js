const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const axios = require('axios');

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

app.get('/', (req, res) => {
  res.send("OKKKKKK")
})

app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, content, recaptchaToken } = req.body;

  // Vérifiez le token reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.json({ error: "error", message: 'Échec de la vérification reCAPTCHA' });
    }
  } catch (error) {
    return res.status(500).json({ error: "error", message: 'Erreur lors de la vérification reCAPTCHA' });
  }

  // Construction du contenu de l'e-mail en HTML
  const emailContent = `
    <div>
      <h2>Nom : ${name}</h2>
      <h3>Adresse e-mail : ${email}</h3>
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
