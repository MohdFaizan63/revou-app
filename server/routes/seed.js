const express = require('express');
const router = express.Router();
const Entity = require('../models/Entity');

// Seed entities directly to database
router.post('/entities', async (req, res) => {
  try {
    const entities = [
      {
        name: "YouTube",
        description: "Video sharing and streaming platform owned by Google",
        category: "app",
        website: "https://youtube.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
      },
      {
        name: "Starbucks",
        description: "International coffeehouse chain",
        category: "place",
        website: "https://starbucks.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
      },
      {
        name: "Tesla Model 3",
        description: "Electric sedan manufactured by Tesla",
        category: "product",
        website: "https://tesla.com/model3",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg"
      },
      {
        name: "Netflix",
        description: "Streaming service for movies and TV shows",
        category: "app",
        website: "https://netflix.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Netflix_2015_logo.svg"
      },
      {
        name: "McDonald's",
        description: "Fast food restaurant chain",
        category: "place",
        website: "https://mcdonalds.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg"
      },
      {
        name: "iPhone 15",
        description: "Latest iPhone model by Apple",
        category: "product",
        website: "https://apple.com/iphone-15",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
      },
      {
        name: "Spotify",
        description: "Music streaming service",
        category: "app",
        website: "https://spotify.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
      },
      {
        name: "Pizza Hut",
        description: "International pizza restaurant chain",
        category: "place",
        website: "https://pizzahut.com",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/73/Pizza_Hut_1967-1999_logo.svg"
      }
    ];

    // Insert all entities
    const result = await Entity.insertMany(entities);
    
    res.json({
      success: true,
      message: `Successfully added ${result.length} entities`,
      entities: result
    });

  } catch (error) {
    console.error('Error seeding entities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed entities',
      error: error.message
    });
  }
});

module.exports = router;