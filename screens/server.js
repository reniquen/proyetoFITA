import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Aquí pones la API Key directamente (solo para pruebas, no recomendado en producción)
const ai = new GoogleGenAI({ apiKey: 'AIzaSyArG2Kc14abo9gFJTxpfmnH7LJnUuOAMIo' });

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });
    res.json({ reply: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error del servidor con Gemini.' });
  }
});

// 🔥 Corriendo en la IP que indicaste (192.168.1.4) y puerto 3000
app.listen(3000, '192.168.1.4', () =>
  console.log('Servidor corriendo en http://192.168.1.4:3000')
);

