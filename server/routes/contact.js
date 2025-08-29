const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/auth')
const {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController')

// Public routes
router.post('/submit', submitContact)

// Protected admin routes
router.get('/admin', protect, admin, getAllContacts)
router.get('/admin/stats', protect, admin, getContactStats)
router.get('/admin/:id', protect, admin, getContact)
router.put('/admin/:id', protect, admin, updateContactStatus)
router.delete('/admin/:id', protect, admin, deleteContact)

module.exports = router
