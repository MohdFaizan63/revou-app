// Quick script to add entities
import { createEntity } from './client/src/services/entityService.js'

const quickAdd = async () => {
  const entities = [
    {
      name: "YouTube",
      description: "Video sharing platform",
      category: "app",
      website: "https://youtube.com"
    },
    {
      name: "Starbucks",
      description: "Coffee shop chain",
      category: "place",
      website: "https://starbucks.com"
    },
    {
      name: "Tesla Model 3",
      description: "Electric sedan",
      category: "product",
      website: "https://tesla.com/model3"
    }
  ]
  for (const entity of entities) {
    try {
      await createEntity(entity)
      console.log(`✅ Added: ${entity.name}`)
    } catch (error) {
      console.log(`❌ Failed: ${entity.name} - ${error.message}`)
    }
  }
}

quickAdd()