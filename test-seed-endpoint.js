// Test script using Node 24 built-in fetch

const API_BASE_URL = 'http://localhost:5005/api';

const entities = [
  { name: "Entity 1", category: "Place", createdBy: "admin" },
  { name: "Entity 2", category: "Product", createdBy: "admin" },
  { name: "Entity 3", category: "Service", createdBy: "admin" }
];

async function seedEntities() {
  try {
    console.log('🌱 Seeding entities via server endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/seed/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entities })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();

    console.log('✅ Success!');
    result.entities.forEach(e => console.log(`  - ${e.name} (${e.category})`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

seedEntities();
