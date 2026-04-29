const express = require('express');
const router = express.Router();
const { chat, clearSession } = require('../services/chatService');
const { v4: uuidv4 } = require('crypto');

// @desc    Send a message to the chatbot
// @route   POST /api/chat
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || message.trim().length === 0) {
            res.status(400);
            throw new Error('Message is required');
        }

        // Use provided sessionId or generate one
        const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        const response = await chat(sid, message.trim());

        res.json({
            response,
            sessionId: sid,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Clear a chat session
// @route   DELETE /api/chat/:sessionId
// @access  Public
router.delete('/:sessionId', (req, res) => {
    clearSession(req.params.sessionId);
    res.json({ message: 'Session cleared' });
});

module.exports = router;
