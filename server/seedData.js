const mongoose = require('mongoose');
const Entity = require('./models/Entity');
const Review = require('./models/Review');
const User = require('./models/User');
const Bookmark = require('./models/Bookmark');
require('dotenv').config();

const sampleEntities = [
  {
    name: 'Netflix',
    description: 'Streaming service for movies and TV shows',
    category: 'website',
    subcategory: 'Entertainment',
    website: 'https://www.netflix.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png',
    tags: ['streaming', 'entertainment', 'movies', 'tv shows'],
    averageRating: 4.2,
    totalReviews: 1250
  },
  {
    name: 'Spotify',
    description: 'Music streaming platform',
    category: 'website',
    subcategory: 'Music',
    website: 'https://www.spotify.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/200px-Spotify_logo_without_text.svg.png',
    tags: ['music', 'streaming', 'playlists', 'podcasts'],
    averageRating: 4.5,
    totalReviews: 890
  },
  {
    name: 'McDonald\'s',
    description: 'Fast food restaurant chain',
    category: 'place',
    subcategory: 'Restaurant',
    website: 'https://www.mcdonalds.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/200px-McDonald%27s_Golden_Arches.svg.png',
    tags: ['fast food', 'restaurant', 'burgers', 'fries'],
    averageRating: 3.8,
    totalReviews: 2100
  },
  {
    name: 'IRCTC',
    description: 'Official Indian Railways website for train bookings',
    category: 'website',
    subcategory: 'Government',
    website: 'https://www.irctc.co.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/IRCTC_Logo.svg/200px-IRCTC_Logo.svg.png',
    tags: ['railways', 'booking', 'government', 'transport'],
    averageRating: 3.2,
    totalReviews: 789
  }
];

const sampleReviews = [
  {
    rating: 4,
    title: 'Great content selection',
    comment: 'Netflix has an amazing library of movies and TV shows. The interface is user-friendly and the streaming quality is excellent.',
    tags: ['Pros', 'Great Service', 'Recommended']
  },
  {
    rating: 3,
    title: 'Could be better',
    comment: 'The content is good but the interface could be improved. Sometimes it\'s hard to find what you\'re looking for.',
    tags: ['Pros', 'Cons']
  },
  {
    rating: 5,
    title: 'Best music platform',
    comment: 'Spotify is hands down the best music streaming service. Great recommendations and easy to use.',
    tags: ['Pros', 'Great Service', 'Recommended']
  },
  {
    rating: 2,
    title: 'Bug-ridden',
    comment: 'Very slow and full of glitches. The app crashes frequently and customer service is unhelpful.',
    tags: ['Cons', 'Poor Experience', 'Not Recommended']
  },
  {
    rating: 3,
    title: 'Saves time',
    comment: 'Clunky design, but gets the job done. Could be faster and more reliable.',
    tags: ['Pros', 'Cons']
  },
  {
    rating: 4,
    title: 'Affordable',
    comment: 'Could be faster, but works fine. Good value for money.',
    tags: ['Pros']
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/revuo');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Entity.deleteMany({});
    await Review.deleteMany({});
    await Bookmark.deleteMany({});
    console.log('Cleared existing data');

    // Create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        bio: 'I love reviewing things and sharing my experiences with the community!',
        location: 'Mumbai, India',
        website: 'https://example.com'
      });
    }

    // Create entities
    const createdEntities = [];
    for (const entityData of sampleEntities) {
      const entity = await Entity.create({
        ...entityData,
        createdBy: testUser._id
      });
      createdEntities.push(entity);
      console.log(`Created entity: ${entity.name}`);
    }

    // Create reviews
    for (let i = 0; i < createdEntities.length; i++) {
      const entity = createdEntities[i];
      const reviewsForEntity = sampleReviews.slice(i * 2, (i + 1) * 2);
      
      for (const reviewData of reviewsForEntity) {
        await Review.create({
          ...reviewData,
          entity: entity._id,
          user: testUser._id
        });
      }
      console.log(`Created ${reviewsForEntity.length} reviews for ${entity.name}`);
    }

    // Create some bookmarks
    for (let i = 0; i < Math.min(createdEntities.length, 2); i++) {
      await Bookmark.create({
        user: testUser._id,
        entity: createdEntities[i]._id
      });
    }
    console.log('Created bookmarks');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();