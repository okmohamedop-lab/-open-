const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// عرض واجهة الموقع عند فتح الرابط الرئيسي
app.use(express.static(__dirname));

const API_KEY = process.env.AI_API_KEY;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'الرجاء إرسال نص الرسالة' });
        }

        const response = await fetch('https://api.bluesminds.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json(data);
        } else {
            console.error("API Error:", data);
            res.status(response.status).json({ error: data.error || 'حدث خطأ من مزود الخدمة' });
        }

    } `catch` (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
