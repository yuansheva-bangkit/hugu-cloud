const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel')

router.get('/profile', async (req, res, next) => {
  const users = await userModel.find({ email: req.user.email })
  res.status(200);
  res.json(users[0]);
}
);

router.post('/chat-bot', async (req, res, next) => {
  const tf = require("@tensorflow/tfjs");
  const tfnode = require("@tensorflow/tfjs-node");
  const users = await userModel.find({ email: req.user.email })

  const handler = tfnode.io.fileSystem(process.env.MODEL_CHAT_URL);
  let model = await tf.loadLayersModel(handler);

  // Make predictions
  const inputText = "Your input text here...";
  const inputTensor = tf.tensor2d([inputText], [1, 1]);
  const output = model.predict(inputTensor);

  // Process the output as needed
  let chat_result = output.dataSync();

  res.status(200);
  res.json({
    result: chat_result
  });
}
);

router.post('/kuesioner', async (req, res, next) => {
  const tf = require("@tensorflow/tfjs");
  const tfnode = require("@tensorflow/tfjs-node");

  const handler = tfnode.io.fileSystem(process.env.MODEL_KUESIONER_URL);
  let model = await tf.loadLayersModel(handler);

  const inputData = req.body.data;
  // Konversi data input menjadi tensor
  const inputTensor = tf.tensor2d([inputData]);
  // Lakukan prediksi dengan model
  const prediction = model.predict(inputTensor).dataSync();
  // Ambil label dari prediksi
  const labelIndex = prediction.indexOf(Math.max(...prediction));
  // Mengembalikan hasil prediksi sebagai respons JSON
  res.json({ result: getLabelFromIndex(labelIndex) });

  // Fungsi untuk mendapatkan label dari indeks
  function getLabelFromIndex(index) {
    // Sesuaikan dengan label yang Anda tetapkan
    const labels = ['Normal', 'Mid', 'Moderate', 'Severe', 'Extreamely Severe'];
    return labels;
  }
}
);


module.exports = router