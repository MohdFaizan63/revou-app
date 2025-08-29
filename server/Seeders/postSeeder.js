const Post = require('../models/Post');
const User = require('../models/User');
const Entity = require('../models/Entity');

const samplePosts = [
  {
    content: "Just had the most amazing coffee at Starbucks! Their new seasonal blend is absolutely perfect. ☕️ #coffee #starbucks #morningvibes",
    tags: ['coffee', 'starbucks', 'morningvibes'],
    entityName: 'Starbucks'
  },
  {
    content: "Watching the latest episode on Netflix and it's absolutely mind-blowing! The plot twists are incredible. 🍿 #netflix #binge #entertainment",
    tags: ['netflix', 'binge', 'entertainment'],
    entityName: 'Netflix'
  },
  {
    content: "Finally tried that new restaurant downtown. The food was incredible and the atmosphere was perfect for a date night! 🍽️ #foodie #datenight #restaurant",
    tags: ['foodie', 'datenight', 'restaurant']
  },
  {
    content: "Just finished reading this amazing book. The character development is phenomenal and the story kept me hooked until the very end! 📚 #books #reading #literature",
    tags: ['books', 'reading', 'literature']
  },
  {
    content: "This new app I downloaded is a game-changer! It's so intuitive and has all the features I've been looking for. 📱 #app #tech #productivity",
    tags: ['app', 'tech', 'productivity']
  }
];

const seedPosts = async () => {
  try {
    // Get a sample user (or create one if none exists)
    let user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Get or create sample entities
    const entities = {};
    for (const post of samplePosts) {
      if (post.entityName) {
        let entity = await Entity.findOne({ name: { $regex: new RegExp(`^${post.entityName}$`, 'i') } });
        if (!entity) {
          entity = await Entity.create({
            name: post.entityName,
            description: `Sample entity for ${post.entityName}`,
            category: 'place',
            createdBy: user._id
          });
        }
        entities[post.entityName] = entity;
      }
    }

    // Create sample posts
    for (const postData of samplePosts) {
      const post = await Post.create({
        user: user._id,
        content: postData.content,
        entity: postData.entityName ? entities[postData.entityName]._id : null,
        entityName: postData.entityName || null,
        tags: postData.tags,
        isPublic: true
      });

      console.log(`Created post: ${post.content.substring(0, 50)}...`);
    }

    console.log('✅ Sample posts seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
  }
};

module.exports = { seedPosts };

// Run seeder if called directly
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return seedPosts();
    })
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}