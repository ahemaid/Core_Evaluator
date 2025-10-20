const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get user conversations
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isIn(['direct', 'appointment', 'support', 'group']),
  query('unreadOnly').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      type,
      unreadOnly = false
    } = req.query;

    const result = await Conversation.getUserConversations(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      unreadOnly
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new conversation
// @route   POST /api/messages/conversations
// @access  Private
router.post('/conversations', [
  body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
  body('participants.*.userId').isMongoId().withMessage('Valid user ID is required'),
  body('participants.*.role').isIn(['user', 'provider', 'admin']).withMessage('Invalid role'),
  body('type').optional().isIn(['direct', 'appointment', 'support', 'group']),
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('relatedEntityType').optional().isIn(['appointment', 'complaint', 'review', 'service']),
  body('relatedEntityId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      participants,
      type = 'direct',
      title,
      description,
      relatedEntityType,
      relatedEntityId
    } = req.body;

    // Add current user to participants if not already included
    const currentUserParticipant = {
      userId: req.user.id,
      role: req.user.role
    };

    const allParticipants = [currentUserParticipant];
    participants.forEach(p => {
      if (p.userId.toString() !== req.user.id.toString()) {
        allParticipants.push(p);
      }
    });

    const conversation = await Conversation.findOrCreateConversation(
      allParticipants,
      { type, title, description, relatedEntityType, relatedEntityId }
    );

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get conversation messages
// @route   GET /api/messages/conversations/:id/messages
// @access  Private
router.get('/conversations/:id/messages', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('before').optional().isISO8601(),
  query('after').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if user is participant in conversation
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p.userId.toString() === req.user.id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      });
    }

    const {
      page = 1,
      limit = 50,
      before,
      after
    } = req.query;

    const result = await Message.getConversationMessages(req.params.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      before,
      after
    });

    // Mark messages as read
    await Message.markConversationAsRead(req.params.id, req.user.id);
    await conversation.updateLastRead(req.user.id);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send message
// @route   POST /api/messages/conversations/:id/messages
// @access  Private
router.post('/conversations/:id/messages', [
  body('content.text').optional().trim().isLength({ max: 2000 }),
  body('messageType').optional().isIn(['text', 'image', 'file', 'system', 'appointment_request', 'appointment_confirmation']),
  body('replyTo').optional().isMongoId(),
  body('metadata.appointmentId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if user is participant in conversation
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      p => p.userId.toString() === req.user.id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation'
      });
    }

    const {
      content,
      messageType = 'text',
      replyTo,
      metadata = {}
    } = req.body;

    // Get recipient (first other participant)
    const recipient = conversation.participants.find(
      p => p.userId.toString() !== req.user.id.toString() && p.isActive
    );

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: 'No recipient found in conversation'
      });
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      senderId: req.user.id,
      recipientId: recipient.userId,
      messageType,
      content,
      replyTo,
      metadata
    });

    await message.save();

    // Update conversation last message
    await conversation.updateLastMessage(
      message._id,
      content.text || '[Media]',
      req.user.id
    );

    // Increment unread count for recipient
    await conversation.incrementUnreadCount(recipient.userId);

    // Send push notification to recipient
    await Notification.createNotification({
      recipientId: recipient.userId,
      senderId: req.user.id,
      type: 'message_received',
      title: 'New Message',
      message: content.text || 'You received a new message',
      relatedEntityType: 'conversation',
      relatedEntityId: conversation._id,
      actions: [
        {
          label: 'View',
          action: 'view_conversation',
          url: `/messages/${conversation._id}`,
          style: 'primary'
        }
      ]
    });

    // Populate message data
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email photo')
      .populate('recipientId', 'name email photo')
      .populate('replyTo', 'content.text senderId');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/messages/:id/read
// @access  Private
router.put('/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
    }

    await message.markAsRead();

    // Update conversation unread count
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      await conversation.resetUnreadCount(req.user.id);
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Edit message
// @route   PUT /api/messages/messages/:id
// @access  Private
router.put('/messages/:id', [
  body('content.text').trim().isLength({ min: 1, max: 2000 }).withMessage('Message text is required and must be between 1 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.senderId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this message'
      });
    }

    // Check if message is too old to edit (e.g., 15 minutes)
    const editTimeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (Date.now() - message.createdAt.getTime() > editTimeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Message is too old to edit'
      });
    }

    await message.edit(req.body.content.text);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/messages/:id
// @access  Private
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.senderId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.deleteMessage(req.user.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add reaction to message
// @route   POST /api/messages/messages/:id/reactions
// @access  Private
router.post('/messages/:id/reactions', [
  body('emoji').trim().isLength({ min: 1, max: 10 }).withMessage('Emoji is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is participant in conversation
    const conversation = await Conversation.findById(message.conversationId);
    const isParticipant = conversation.participants.some(
      p => p.userId.toString() === req.user.id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to react to this message'
      });
    }

    await message.addReaction(req.user.id, req.body.emoji);

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: message
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove reaction from message
// @route   DELETE /api/messages/messages/:id/reactions
// @access  Private
router.delete('/messages/:id/reactions', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.removeReaction(req.user.id);

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: message
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get message statistics
// @route   GET /api/messages/stats
// @access  Private
router.get('/stats', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { period = 'monthly' } = req.query;

    const [messageStats, conversationStats] = await Promise.all([
      Message.getMessageStats(req.user.id, period),
      Conversation.getConversationStats(req.user.id, period)
    ]);

    res.json({
      success: true,
      data: {
        messages: messageStats,
        conversations: conversationStats
      }
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Archive conversation
// @route   PUT /api/messages/conversations/:id/archive
// @access  Private
router.put('/conversations/:id/archive', [
  body('reason').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p.userId.toString() === req.user.id.toString() && p.isActive
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to archive this conversation'
      });
    }

    await conversation.archive(req.user.id, req.body.reason);

    res.json({
      success: true,
      message: 'Conversation archived successfully'
    });
  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
