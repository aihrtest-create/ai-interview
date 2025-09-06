const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Настройка multer для загрузки файлов
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB лимит
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Proxy server is running' });
});

// OpenRouter API proxy
app.post('/api/openrouter', async (req, res) => {
    try {
        const { model, messages, max_tokens, temperature } = req.body;
        const apiKey = req.headers.authorization?.replace('Bearer ', '');

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model,
            messages,
            max_tokens,
            temperature
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': req.headers['http-referer'] || 'http://localhost:3000',
                'X-Title': req.headers['x-title'] || 'AI Interview Trainer'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('OpenRouter API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'OpenRouter API error',
            details: error.response?.data || error.message
        });
    }
});

// Gemini API proxy
app.post('/api/gemini/:model', async (req, res) => {
    try {
        const { model } = req.params;
        const { apiKey } = req.query;
        const { contents, generationConfig } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                contents,
                generationConfig
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Gemini API error',
            details: error.response?.data || error.message
        });
    }
});

// STT API proxy
app.post('/api/stt', upload.single('audio'), async (req, res) => {
    try {
        const { provider, apiKey } = req.body;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        let transcript = '';

        if (provider === 'elevenlabs') {
            transcript = await callElevenLabsSTT(audioFile, apiKey);
        } else if (provider === 'yandex') {
            transcript = await callYandexSTT(audioFile, apiKey);
        } else {
            return res.status(400).json({ error: 'Unsupported STT provider' });
        }

        res.json({ transcript });
    } catch (error) {
        console.error('STT API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'STT API error',
            details: error.response?.data || error.message
        });
    }
});

// TTS API proxy
app.post('/api/tts', async (req, res) => {
    try {
        const { text, provider, voice, apiKey } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        let audioBlob;

        if (provider === 'elevenlabs') {
            audioBlob = await callElevenLabsTTS(text, voice, apiKey);
        } else if (provider === 'yandex') {
            audioBlob = await callYandexTTS(text, voice, apiKey);
        } else {
            return res.status(400).json({ error: 'Unsupported TTS provider' });
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBlob);
    } catch (error) {
        console.error('TTS API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'TTS API error',
            details: error.response?.data || error.message
        });
    }
});

// TTS Generate API proxy (for audio generation without playback)
app.post('/api/tts/generate', async (req, res) => {
    try {
        const { text, provider, voice, apiKey } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        let audioBlob;

        if (provider === 'elevenlabs') {
            audioBlob = await callElevenLabsTTS(text, voice, apiKey);
        } else if (provider === 'yandex') {
            audioBlob = await callYandexTTS(text, voice, apiKey);
        } else {
            return res.status(400).json({ error: 'Unsupported TTS provider' });
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBlob);
    } catch (error) {
        console.error('TTS Generate API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'TTS Generate API error',
            details: error.response?.data || error.message
        });
    }
});

// ElevenLabs TTS function
async function callElevenLabsTTS(text, voice, apiKey) {
    const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
        }
    }, {
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
}

// Yandex SpeechKit TTS function
async function callYandexTTS(text, voice, apiKey) {
    const response = await axios.post('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', 
        new URLSearchParams({
            text: text,
            lang: 'ru-RU',
            voice: voice,
            format: 'mp3',
            speed: '1.0',
            emotion: 'neutral'
        }), {
        headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
}

// ElevenLabs STT function
async function callElevenLabsSTT(audioFile, apiKey) {
    const formData = new FormData();
    formData.append('audio', audioFile.buffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
    });

    const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.text;
}

// Yandex SpeechKit STT function
async function callYandexSTT(audioFile, apiKey) {
    // Конвертируем аудио в base64
    const base64Audio = audioFile.buffer.toString('base64');

    const response = await axios.post('https://stt.api.cloud.yandex.net/speech/v1/stt:recognize', {
        config: {
            specification: {
                languageCode: 'ru-RU',
                audioEncoding: 'LINEAR16_PCM',
                sampleRateHertz: 16000
            }
        },
        audio: {
            content: base64Audio
        }
    }, {
        headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data.result;
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, '../')}`);
    console.log(`🎤 STT API endpoints available`);
    console.log(`🤖 LLM API endpoints available`);
    console.log(`\n💡 Open your browser and go to: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down proxy server...');
    process.exit(0);
});
