const Contact = require('../models/Contact')

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    // Create contact submission
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'pending',
      submittedAt: new Date()
    })

    await contact.save()

    // Email notification placeholder for production
    // In production, integrate with email service like SendGrid, Mailgun, or Nodemailer
    if (process.env.NODE_ENV === 'production') {
      // await sendEmailNotification(contact)
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We\'ll get back to you within 24 hours.',
      data: {
        id: contact._id,
        submittedAt: contact.submittedAt
      }
    })

  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.'
    })
  }
}

// Get all contact submissions (admin only)
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const query = {}
    if (status) {
      query.status = status
    }

    const contacts = await Contact.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Contact.countDocuments(query)

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    })

  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions'
    })
  }
}

// Get single contact submission (admin only)
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })

  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submission'
    })
  }
}

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      })
    }

    contact.status = status || contact.status
    if (adminResponse) {
      contact.adminResponse = adminResponse
      contact.respondedAt = new Date()
    }

    await contact.save()

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    })

  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    })
  }
}

// Delete contact submission (admin only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      })
    }

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    })

  } catch (error) {
    console.error('Delete contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact submission'
    })
  }
}

// Get contact statistics (admin only)
const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments()
    const pending = await Contact.countDocuments({ status: 'pending' })
    const responded = await Contact.countDocuments({ status: 'responded' })
    const resolved = await Contact.countDocuments({ status: 'resolved' })

    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recent = await Contact.countDocuments({
      submittedAt: { $gte: sevenDaysAgo }
    })

    res.json({
      success: true,
      data: {
        total,
        pending,
        responded,
        resolved,
        recent
      }
    })

  } catch (error) {
    console.error('Get contact stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    })
  }
}

module.exports = {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
}
