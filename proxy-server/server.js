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
        fileSize: 50 * 1024 * 1024 // 50MB лимит для аудио файлов
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

        console.log('STT request received:', { 
            provider, 
            apiKey: apiKey ? 'Present' : 'Missing',
            audioFile: audioFile ? 'Present' : 'Missing'
        });

        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        let transcript = '';

        if (provider === 'deepgram') {
            transcript = await callDeepgramSTT(audioFile, apiKey);
        } else {
            return res.status(400).json({ error: 'Unsupported STT provider' });
        }

        console.log('STT response:', { transcript: transcript ? 'Success' : 'Empty' });
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

// Generate Report API
app.post('/api/generate-report', async (req, res) => {
    try {
        console.log('Generate Report API called');
        const { messages, provider, reportPrompt } = req.body;

        console.log('Request data:', {
            messagesLength: messages ? messages.length : 0,
            provider: provider,
            reportPromptLength: reportPrompt ? reportPrompt.length : 0
        });

        if (!messages) {
            console.log('Error: Messages are required');
            return res.status(400).json({ error: 'Messages are required' });
        }

        if (!reportPrompt) {
            console.log('Error: Report prompt is required');
            return res.status(400).json({ error: 'Report prompt is required' });
        }

        let report;

        if (provider === 'openrouter') {
            console.log('Generating report with OpenRouter...');
            report = await generateReportWithOpenRouter(messages, reportPrompt);
        } else if (provider === 'gemini') {
            console.log('Generating report with Gemini...');
            report = await generateReportWithGemini(messages, reportPrompt);
        } else {
            console.log('Error: Unsupported provider:', provider);
            return res.status(400).json({ error: 'Unsupported provider' });
        }

        console.log('Report generated successfully, length:', report ? report.length : 0);
        res.json({ report });
    } catch (error) {
        console.error('Generate Report API error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Generate Report API error',
            details: error.response?.data || error.message
        });
    }
});

// ElevenLabs TTS function
async function callElevenLabsTTS(text, voice, apiKey) {
    try {
        console.log('ElevenLabs TTS request:', { text: text.substring(0, 50) + '...', voice, apiKey: apiKey ? 'Present' : 'Missing' });
        
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
            responseType: 'arraybuffer',
            timeout: 30000
        });

        console.log('ElevenLabs TTS response:', { status: response.status, dataSize: response.data.length });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('ElevenLabs TTS error:', error.response?.data || error.message);
        throw new Error(`ElevenLabs TTS failed: ${error.response?.data || error.message}`);
    }
}

// Yandex SpeechKit TTS function
async function callYandexTTS(text, voice, apiKey) {
    try {
        console.log('Yandex TTS request:', { text: text.substring(0, 50) + '...', voice, apiKey: apiKey ? 'Present' : 'Missing' });
        
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
            responseType: 'arraybuffer',
            timeout: 30000
        });

        console.log('Yandex TTS response:', { status: response.status, dataSize: response.data.length });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Yandex TTS error:', error.response?.data || error.message);
        throw new Error(`Yandex TTS failed: ${error.response?.data || error.message}`);
    }
}

// Deepgram STT function
async function callDeepgramSTT(audioFile, apiKey) {
    try {
        console.log('Deepgram STT request:', { 
            apiKey: apiKey ? 'Present' : 'Missing',
            audioSize: audioFile.buffer.length,
            audioType: audioFile.mimetype || 'unknown'
        });

        // Определяем модель из параметров запроса (по умолчанию nova-2)
        const model = 'nova-2';
        
        // Определяем правильный Content-Type для Deepgram
        let contentType = 'audio/wav';
        if (audioFile.mimetype) {
            if (audioFile.mimetype.includes('webm')) {
                contentType = 'audio/webm';
            } else if (audioFile.mimetype.includes('ogg')) {
                contentType = 'audio/ogg';
            } else if (audioFile.mimetype.includes('wav')) {
                contentType = 'audio/wav';
            } else if (audioFile.mimetype.includes('mp3')) {
                contentType = 'audio/mp3';
            }
        }
        
        console.log('Sending to Deepgram with Content-Type:', contentType);

        // Deepgram принимает аудио напрямую как binary data
        const response = await axios.post('https://api.deepgram.com/v1/listen', audioFile.buffer, {
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': contentType
            },
            params: {
                model: model,
                language: 'ru', // Русский язык для лучшего распознавания
                smart_format: true,
                punctuate: true,
                diarize: false,
                multichannel: false
            },
            timeout: 30000
        });

        console.log('Deepgram STT response:', { 
            status: response.status, 
            result: response.data.results ? 'Present' : 'Empty' 
        });

        // Извлекаем текст из ответа Deepgram
        if (response.data && response.data.results && response.data.results.channels && 
            response.data.results.channels[0] && response.data.results.channels[0].alternatives && 
            response.data.results.channels[0].alternatives[0]) {
            return response.data.results.channels[0].alternatives[0].transcript;
        } else {
            console.warn('Deepgram returned empty result:', response.data);
            return '';
        }
    } catch (error) {
        console.error('Deepgram STT error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        
        // Более детальная обработка ошибок
        if (error.response?.status === 401) {
            throw new Error('Deepgram STT: Unauthorized - проверьте API ключ');
        } else if (error.response?.status === 400) {
            throw new Error(`Deepgram STT: Bad Request - ${error.response?.data?.message || 'неверный формат запроса'}`);
        } else if (error.response?.status === 403) {
            throw new Error('Deepgram STT: Forbidden - нет доступа к Deepgram API');
        } else {
            throw new Error(`Deepgram STT failed: ${error.response?.data?.message || error.message}`);
        }
    }
}

// Generate Report with OpenRouter
async function generateReportWithOpenRouter(messages, reportPrompt) {
    try {
        console.log('Generating report with OpenRouter...');
        
        const openrouterApiKey = process.env.OPENROUTER_API_KEY;
        if (!openrouterApiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'openai/gpt-4o',
            messages: [
                { role: 'system', content: reportPrompt },
                ...messages
            ],
            max_tokens: 2000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${openrouterApiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
                'X-Title': 'AI Interview Trainer'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter report generation error:', error.response?.data || error.message);
        throw new Error(`OpenRouter report generation failed: ${error.response?.data || error.message}`);
    }
}

// Generate Report with Gemini
async function generateReportWithGemini(messages, reportPrompt) {
    try {
        console.log('Generating report with Gemini...');
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        let conversationText = reportPrompt + "\n\n";
        messages.forEach(msg => {
            conversationText += `${msg.role === 'user' ? 'Кандидат' : 'Интервьюер'}: ${msg.content}\n\n`;
        });
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: conversationText
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini report generation error:', error.response?.data || error.message);
        throw new Error(`Gemini report generation failed: ${error.response?.data || error.message}`);
    }
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
