// server.js (Node.js)
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// مفتاح الـ API الخاص بك
const API_KEY = "حط_مفتاحك_هنا";

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        // هيستخدّم gemini-3.5-flash كافتراضي زي ما طلبت
        const model = req.body.model || "gemini-3.5-flash"; 

        if (!userPrompt) {
            return res.status(400).json({ error: "الرجاء إرسال النص" });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && (data.candidates[0] || data.candidates[1])) {
            const replyText = data.candidates[0].content.parts[0].text;
            return res.json({ success: true, reply: replyText });
        } else {
            return res.status(500).json({ success: false, error: "خطأ في رد الذكاء الاصطناعي (تأكد أن اسم الموديل مدعوم من المفتاح)" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
