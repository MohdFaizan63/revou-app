import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, HelpCircle, BookOpen, MessageCircle, Settings, Users, Star, BarChart3, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState({})
  const [activeCategory, setActiveCategory] = useState('general')

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'entities', name: 'Entities & Reviews', icon: Star },
    { id: 'compare', name: 'Compare Feature', icon: BarChart3 },
    { id: 'account', name: 'Account & Profile', icon: Users },
    { id: 'technical', name: 'Technical Issues', icon: Settings }
  ]

  const faqData = {
    general: [
      {
        question: "What is Revuo?",
        answer: "Revuo is a comprehensive review platform that allows users to discover, review, and compare various entities including apps, websites, products, services, restaurants, and more. Our platform provides detailed insights and user-generated reviews to help you make informed decisions."
      },
      {
        question: "How do I get started?",
        answer: "Getting started is easy! Simply create an account, browse entities, read reviews, and start contributing your own reviews. You can also use our compare feature to compare multiple entities side-by-side."
      },
      {
        question: "Is Revuo free to use?",
        answer: "Yes, Revuo is completely free to use! You can browse entities, read reviews, and contribute your own reviews without any cost. We believe in providing valuable information to everyone."
      },
      {
        question: "How can I contact support?",
        answer: "You can contact our support team through our Contact page, email us at revoumail@gmail.com, or use the contact form. We typically respond within 24 hours."
      }
    ],
    entities: [
      {
        question: "How do I add a new entity?",
        answer: "To add a new entity, you need to be logged in. Click on 'Add Entity' in the navigation, fill out the required information including name, description, category, and any additional details. Your submission will be reviewed and published."
      },
      {
        question: "How do I write a good review?",
        answer: "A good review should be honest, detailed, and helpful to other users. Include your personal experience, pros and cons, and a rating. Be specific about what you liked or didn't like, and provide constructive feedback."
      },
      {
        question: "Can I edit or delete my reviews?",
        answer: "Yes, you can edit or delete your reviews from your profile page. Go to your profile, navigate to the 'My Reviews' tab, and you'll see options to edit or delete your reviews."
      },
      {
        question: "How are entity ratings calculated?",
        answer: "Entity ratings are calculated as the average of all user reviews. We use a weighted system that considers the number of reviews and their recency to provide accurate and fair ratings."
      }
    ],
    compare: [
      {
        question: "How does the compare feature work?",
        answer: "The compare feature allows you to select up to 4 entities and view them side-by-side. Click the 'Compare' button on any entity card to add it to your comparison. You can then view detailed comparisons of ratings, reviews, and other attributes."
      },
      {
        question: "How many entities can I compare at once?",
        answer: "You can compare up to 4 entities at once. This limit ensures optimal performance and readability of the comparison results."
      },
      {
        question: "Can I share my comparisons?",
        answer: "Yes! The comparison URL can be shared with others. Simply copy the URL from your browser when viewing a comparison, and others can see the same comparison results."
      },
      {
        question: "How do I remove entities from comparison?",
        answer: "On the compare page, you can remove entities by clicking the remove button next to each entity. The URL will automatically update to reflect your changes."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click on 'Sign Up' in the navigation, fill out the registration form with your email, username, and password. Verify your email address, and you're ready to start using Revuo!"
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "On the login page, click 'Forgot Password?' and enter your email address. You'll receive a password reset link via email. Click the link to set a new password."
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to your profile page, click 'Edit Profile', and update your information. You can change your username, email, avatar, and other profile details. Don't forget to save your changes."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to your profile page, navigate to the 'Settings' tab, and click 'Delete Account'. Please note that this action is irreversible and will permanently delete all your data."
      }
    ],
    technical: [
      {
        question: "The website is loading slowly. What should I do?",
        answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, it might be a temporary server issue. Please try again later or contact support."
      },
      {
        question: "I'm having trouble uploading images. What's wrong?",
        answer: "Make sure your image is in a supported format (JPG, PNG, GIF) and under 5MB. If you're still having issues, try using a different browser or check your internet connection."
      },
      {
        question: "The compare feature isn't working properly.",
        answer: "Try refreshing the page and clearing your browser cache. Make sure you're not trying to compare more than 4 entities. If the issue continues, please contact support with specific details about the problem."
      },
      {
        question: "I'm getting error messages. What should I do?",
        answer: "Note down the exact error message and try refreshing the page. If the error persists, contact our support team with the error details, your browser information, and steps to reproduce the issue."
      }
    ]
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const filteredFAQs = searchQuery
    ? Object.values(faqData).flat().filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory] || []

  const popularTopics = [
    { title: "Getting Started", icon: BookOpen, link: "#getting-started" },
    { title: "Writing Reviews", icon: MessageCircle, link: "#writing-reviews" },
    { title: "Compare Feature", icon: BarChart3, link: "#compare-feature" },
    { title: "Account Settings", icon: Settings, link: "#account-settings" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to your questions and learn how to use Revuo effectively
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <div className="space-y-3">
                  <Link
                    to="/contact"
                    className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Link>
                  <a
                    href="mailto:revoumail@gmail.com"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Popular Topics */}
            {!searchQuery && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularTopics.map((topic) => {
                    const Icon = topic.icon
                    return (
                      <a
                        key={topic.title}
                        href={topic.link}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <Icon className="w-6 h-6 text-primary-600" />
                        <span className="font-medium text-gray-900">{topic.title}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery ? 'Search Results' : `${categories.find(c => c.id === activeCategory)?.name} FAQs`}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">
                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <div key={index} className="p-6">
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {expandedSections[index] ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedSections[index] && (
                        <div className="mt-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse our categories for help.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                <p className="text-primary-100 mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="mailto:revoumail@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-sm font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
