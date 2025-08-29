import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Search, 
  Star, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  MapPin, 
  Film, 
  ShoppingBag, 
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Zap,
  ChevronDown,
  Check,
  MessageCircle,
  Shield,
  Clock,
  Heart,
  ThumbsUp,
  Eye,
  Download,
  Play,
  BookOpen,
  Target,
  BarChart3,
  Lightbulb,
  Star as StarIcon
} from 'lucide-react'
import { getEntities } from '../services/entityService'
import SearchBar from '../components/SearchBar'
import AddToRevuoModal from '../components/AddToRevuoModal'

const Home = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalData, setAddModalData] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [isSearchFixed, setIsSearchFixed] = useState(false)
  const queryClient = useQueryClient()

  // Handle scroll for search bar positioning
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSearchFixed(scrollPosition > 100) // Fix search bar after 100px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prefetch common data for instant navigation
  useEffect(() => {
    // Prefetch categories data
    queryClient.prefetchQuery(
      ['entities', { category: 'website', sort: 'averageRating', limit: 50 }],
      () => getEntities({ category: 'website', sort: 'averageRating', limit: 50 }),
      { staleTime: 5 * 60 * 1000 }
    )

    // Prefetch top rated entities
    queryClient.prefetchQuery(
      ['entities', { sort: 'averageRating', limit: 50 }],
      () => getEntities({ sort: 'averageRating', limit: 50 }),
      { staleTime: 5 * 60 * 1000 }
    )
  }, [queryClient])

  // Fetch trending entities
  const { data: trendingData } = useQuery(
    ['entities', { limit: 6, sort: 'viewCount' }],
    () => getEntities({ limit: 6, sort: 'viewCount' }),
    {
      staleTime: 5 * 60 * 1000,
    }
  )

  const handleAddToRevuo = (data) => {
    setAddModalData(data)
    setShowAddModal(true)
  }

  const handleAddAnything = () => {
    setAddModalData(null)
    setShowAddModal(true)
  }

  const categories = [
    { name: 'Websites', icon: Globe, color: 'from-blue-500 to-blue-600', count: '2.5k+' },
    { name: 'Apps', icon: Smartphone, color: 'from-purple-500 to-purple-600', count: '1.8k+' },
    { name: 'Places', icon: MapPin, color: 'from-green-500 to-green-600', count: '3.2k+' },
    { name: 'Movies', icon: Film, color: 'from-red-500 to-red-600', count: '1.1k+' },
    { name: 'Products', icon: ShoppingBag, color: 'from-orange-500 to-orange-600', count: '4.1k+' },
    { name: 'Services', icon: Award, color: 'from-indigo-500 to-indigo-600', count: '2.9k+' }
  ]

  const faqs = [
    {
      question: "What makes Revuo different from other review platforms?",
      answer: "Revuo is the only universal review platform where you can rate literally anything - from your favorite coffee shop to the latest mobile app, from blockbuster movies to everyday products. Our intelligent search and comprehensive categorization make it easy to find and review anything that matters to you."
    },
    {
      question: "How do I know the reviews are authentic?",
      answer: "We use advanced verification systems and community moderation to ensure all reviews are genuine. Users can only review entities they've actually experienced, and our community helps flag any suspicious activity. Plus, we encourage detailed, thoughtful reviews with photos and specific experiences."
    },
    {
      question: "Can businesses respond to reviews?",
      answer: "Yes! Business owners can claim their listings and respond to reviews, helping them engage with their customers and address any concerns. This creates a two-way conversation that benefits both businesses and consumers."
    },
    {
      question: "Is Revuo free to use?",
      answer: "Absolutely! Revuo is completely free for users. You can search, read reviews, and write your own reviews without any cost. We believe everyone should have access to honest, reliable information to make better decisions."
    },
    {
      question: "How do you handle fake or inappropriate reviews?",
      answer: "We have a robust moderation system that combines AI detection with human review. Users can report suspicious reviews, and our team investigates each case. We also use pattern recognition to identify and remove fake reviews automatically."
    },
    {
      question: "Can I export my reviews or data?",
      answer: "Yes, you have full control over your data. You can export your reviews, ratings, and profile information at any time. We believe in data portability and transparency."
    }
  ]

  const features = [
    {
      icon: Target,
      title: "Universal Reviews",
      description: "Rate anything and everything - from local businesses to global brands, apps to movies, products to services."
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Get detailed insights with rating distributions, trend analysis, and personalized recommendations."
    },
    {
      icon: Shield,
      title: "Trusted Community",
      description: "Join a community of honest reviewers with verified accounts and authentic experiences."
    },
    {
      icon: Zap,
      title: "Instant Search",
      description: "Find what you're looking for instantly with our intelligent search and smart categorization."
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Get recommendations based on your interests, location, and previous reviews."
    },
    {
      icon: MessageCircle,
      title: "Rich Interactions",
      description: "Engage with other reviewers, ask questions, and share detailed experiences with photos."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Food Blogger",
      content: "Revuo has transformed how I discover new restaurants. The detailed reviews and photos help me make informed decisions, and I love being able to contribute to the community.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Enthusiast",
      content: "As someone who tries a lot of apps, Revuo is my go-to for honest reviews. The community here really knows their stuff, and the ratings are always spot-on.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Traveler",
      content: "I use Revuo for everything - from finding the best coffee shops in new cities to choosing which movies to watch. It's become an essential part of my decision-making process.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Fixed Search Bar - Only shows when scrolled */}
      {isSearchFixed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <SearchBar onAddToRevuo={handleAddToRevuo} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 w-48 h-48 sm:top-20 sm:left-10 sm:w-72 sm:h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-4 w-48 h-48 sm:top-40 sm:right-10 sm:w-72 sm:h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 left-8 w-48 h-48 sm:-bottom-8 sm:left-20 sm:w-72 sm:h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-32">
          <div className="text-center">
            {/* Main Headline */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Discover. Rate.
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Share.
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                The universal review platform where you can rate anything and everything. 
                From apps to restaurants, movies to products - your opinion matters.
              </p>
            </div>

            {/* Search Bar - Initial position below navigation */}
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar onAddToRevuo={handleAddToRevuo} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
              <button
                onClick={handleAddAnything}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2 touch-button"
              >
                <Plus className="w-5 h-5" />
                <span>Add Anything to Revuo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/categories"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2 touch-button"
              >
                <Globe className="w-5 h-5" />
                <span>Explore Categories</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">50K+</div>
                <div className="text-sm sm:text-base text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">15K+</div>
                <div className="text-sm sm:text-base text-gray-600">Entities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">25K+</div>
                <div className="text-sm sm:text-base text-gray-600">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">4.8</div>
                <div className="text-sm sm:text-base text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Rate Everything
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              From the latest apps to your favorite restaurants, discover and review anything that matters to you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/categories?category=${category.name.toLowerCase()}`}
                className="group relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-200 border border-gray-100 cursor-pointer touch-button"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{category.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Revuo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most comprehensive review platform designed for the modern user.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what people are talking about and discover the most popular entities on Revuo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingData?.entities?.slice(0, 6).map((entity) => (
              <Link
                key={entity._id}
                to={`/entity/${entity._id}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-200 border border-gray-100 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  {entity.logo ? (
                    <img
                      src={entity.logo}
                      alt={entity.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {entity.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {entity.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= entity.averageRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {entity.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {entity.totalReviews} reviews
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust Revuo for honest reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with Revuo in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Search</h3>
              <p className="text-gray-600">
                Find what you're looking for with our intelligent search. Can't find it? Add it yourself!
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Rate</h3>
              <p className="text-gray-600">
                Share your experience with detailed ratings, reviews, and photos to help others.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Connect</h3>
              <p className="text-gray-600">
                Join the community, discover new favorites, and make informed decisions together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Revuo.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Reviewing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already sharing their experiences on Revuo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleAddAnything}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Review</span>
            </button>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add to Revuo Modal */}
      <AddToRevuoModal
        isOpen={showAddModal}
        initialData={addModalData}
        onClose={() => {
          setShowAddModal(false)
          setAddModalData(null)
        }}
      />
    </div>
  )
}

export default Home