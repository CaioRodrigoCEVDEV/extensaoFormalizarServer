const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.Port || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function sendToOpenAI(text) {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_LLM}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                                Você é um reescritor de texto.

                                Sua única função é reformular o texto mantendo 100% das informações originais.

                                PROIBIDO:
                                - Explicar
                                - Resumir
                                - Completar
                                - Inferir
                                - Melhorar conteúdo

                                PERMITIDO:
                                - Ajustar gramática
                                - Ajustar pontuação
                                - Ajustar fluidez
                                - Ajustar tom

                                Se alterar qualquer informação, a resposta está errada.

                                Retorne apenas o texto final.
                                `
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.2,
            max_tokens: 500
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data);

        throw new Error(
            data?.error?.message || 'Erro na OpenAI'
        );
    }

    return data.choices[0].message.content.trim();
}

app.post('/rewrite', async (req, res) => {

    try {

        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Texto inválido'
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                error: 'Texto muito grande'
            });
        }

        const rewrittenText = await sendToOpenAI(text);

        res.json({
            success: true,
            rewrittenText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});