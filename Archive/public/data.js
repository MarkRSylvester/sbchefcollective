/* @ts-check */
/* Content-Type: text/javascript */

// Fallback data in case the Airtable API connection fails

// Color palette for menu backgrounds
const MENU_COLORS = {
    "Surf & Turf Soirée": "#ffd7b3",
    "Pizza Night": "#ffe199",
    "Farm to Table": "#aee0a1",
    "Pasta & Salads": "#b6d89f",
    "Brunch in Bloom": "#fff4dc",
    "Thanksgiving": "#f5c6a0",
    "Sushi (Wasabi)": "#caf2e6",
    "Mexican Mesa": "#f8caa5",
    "Greek (Santorini)": "#a8caff",
    "Mediterranean": "#efe2bd",
    "Christmas": "#e7b8c1",
    "Cocktail Party": "#b7d6f2",
    "Asian Fusion": "#f9b9b7",
    "Fresh Catch": "#a9e5dc",
    "Paella Picnic": "#d2f1a3"
};

/**
 * @typedef {Object} Chef
 * @property {string} id
 * @property {string} chef_id
 * @property {string} name
 * @property {string} imageUrl
 * @property {string} vibe
 * @property {string} bio
 */

/**
 * @typedef {Object} Menu
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} type
 */

/**
 * @typedef {Object} Dish
 * @property {string} dishId
 * @property {string} dishName
 * @property {string} description
 * @property {string} category
 */

// Fallback chef data
const FALLBACK_CHEFS = [
  {
    id: "chef1",
    chef_id: "C01",
    name: "Coco Martinez",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6291943b0cf3ea2c2ff3e83e/1656026075191-V23CGPR1V7N1LQYQL7BL/female-chef.jpg",
    vibe: "Mediterranean, Seasonal, Vibrant",
    bio: "Chef Coco founded the Santa Barbara Chef Collective in 2022 to bring together talented chefs and the vibrant, food-loving community of Santa Barbara. After eight years as a private yacht chef, she returned home—back on land, near family, and finally able to plant vegetables in the ground. Her culinary journey was inspired by time spent in charming French villages, where she fell in love with fresh markets, rich cheeses, and the everyday celebration of food. She later trained at Tante Marie's Cooking School in San Francisco to refine her craft. Coco is passionate about local, fresh, organic ingredients, and she specializes in Mediterranean and Californian cuisine, always cooking with intention, seasonality, and a deep sense of place."
  },
  {
    id: "chef2",
    chef_id: "C02",
    name: "James Watkins",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6291943b0cf3ea2c2ff3e83e/1656026100723-G6KRDMF03ZY99W2N9GBW/chef-portrait.jpg",
    vibe: "Classic French, Refined, Elegant",
    bio: "With training in classic French techniques, Chef James creates elegant dishes that showcase his attention to detail and passion for traditional flavors with a modern presentation. His culinary journey began in Paris where he apprenticed under Michelin-starred chefs, developing a deep respect for technique and precision. Upon returning to California, James blended his classical training with the abundant local ingredients of the Central Coast. He specializes in refined dinner parties and intimate celebrations where his artful presentations and balanced flavors create memorable dining experiences."
  },
  {
    id: "chef3",
    chef_id: "C03",
    name: "Sofia Chen",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6291943b0cf3ea2c2ff3e83e/1656026138878-6W9W8K9YSMI243QZSB3Y/female-chef-2.jpg",
    vibe: "Asian Fusion, Creative, Bold",
    bio: "Chef Sofia brings together flavors from across Asia with California farm-fresh ingredients. Her innovative approach creates unexpected combinations with bold, memorable flavors. Sofia grew up in a culinary family with restaurants in both Taiwan and Los Angeles, giving her a unique perspective on blending Eastern and Western techniques. After graduating from the Culinary Institute of America, she worked at renowned restaurants in San Francisco and New York before settling in Santa Barbara. Sofia specializes in interactive dining experiences, including dumpling-making classes and multi-course tasting menus that tell a story through food."
  }
];

// Fallback menu data
const FALLBACK_MENUS = [
  {
    id: "menu1",
    name: "Surf & Turf Soirée",
    description: "An indulgent celebration of land and sea, designed for elegant evenings and fire-lit feasts.",
    type: "Dinner"
  },
  {
    id: "menu2",
    name: "Mediterranean Feast",
    description: "A vibrant spread of Mediterranean favorites featuring bright flavors and farm-fresh ingredients.",
    type: "Dinner"
  },
  {
    id: "menu3",
    name: "Farm to Table",
    description: "Seasonal ingredients sourced from local farms, prepared with simplicity to highlight natural flavors.",
    type: "Lunch/Dinner"
  },
  {
    id: "menu4",
    name: "Brunch in Bloom",
    description: "A sun-drenched midmorning feast that celebrates the coastal harvest, perfect for garden gatherings or laid-back luxury.",
    type: "Brunch"
  }
];

// Fallback dish data
const FALLBACK_DISHES = {
  "menu1": [
    {
      dishId: "dish1",
      dishName: "Oysters on the Half Shell with Champagne Mignonette",
      description: "Local oysters served with a shallot-champagne vinegar mignonette and microgreens.",
      category: "Appetizers"
    },
    {
      dishId: "dish2",
      dishName: "Grilled Shrimp Skewers with Romesco Sauce",
      description: "Skewered marinated prawns charred over flame, served with smoky Spanish romesco.",
      category: "Appetizers"
    },
    {
      dishId: "dish3",
      dishName: "Beef Tartare on Crispy Rice Cakes",
      description: "Hand-chopped tenderloin atop crispy rice, finished with quail egg yolk and truffle oil.",
      category: "Appetizers"
    },
    {
      dishId: "dish4",
      dishName: "Filet Mignon with Red Wine Reduction",
      description: "Grass-fed filet, pan-seared and served with a cabernet demi-glace and herb compound butter.",
      category: "Mains"
    },
    {
      dishId: "dish5",
      dishName: "Butter-Poached Lobster Tails",
      description: "Sweet lobster tails slow-poached in herbed butter and finished with citrus zest.",
      category: "Mains"
    },
    {
      dishId: "dish6",
      dishName: "Seared Scallops with Corn Purée",
      description: "Dayboat scallops with a silky sweet corn purée and crispy pancetta crumble.",
      category: "Mains"
    },
    {
      dishId: "dish7",
      dishName: "Charred Broccolini with Garlic & Lemon",
      description: "Grilled broccolini with toasted garlic, lemon juice, and chili flakes.",
      category: "Sides"
    },
    {
      dishId: "dish8",
      dishName: "Truffle Mashed Potatoes",
      description: "Yukon Golds whipped with crème fraiche and black truffle oil.",
      category: "Sides"
    },
    {
      dishId: "dish9",
      dishName: "Grilled Corn with Cotija & Lime",
      description: "Smoky corn on the cob with lime crema, cotija, and paprika.",
      category: "Sides"
    }
  ],
  "menu2": [
    {
      dishId: "dish10",
      dishName: "Greek Mezze Platter",
      description: "Hummus, tzatziki, olives, feta, and warm pita bread.",
      category: "Appetizers"
    },
    {
      dishId: "dish11",
      dishName: "Grilled Mediterranean Sea Bass",
      description: "Whole fish grilled with lemon, herbs, and olive oil.",
      category: "Mains"
    },
    {
      dishId: "dish12",
      dishName: "Lamb Kofta Skewers",
      description: "Spiced ground lamb skewers with cucumber-mint yogurt sauce.",
      category: "Mains"
    },
    {
      dishId: "dish13",
      dishName: "Saffron Rice Pilaf",
      description: "Fragrant basmati rice with saffron, pine nuts, and dried fruits.",
      category: "Sides"
    },
    {
      dishId: "dish14",
      dishName: "Tabbouleh Salad",
      description: "Bulgur wheat with parsley, mint, tomatoes, and lemon vinaigrette.",
      category: "Sides"
    }
  ],
  "menu3": [
    {
      dishId: "dish15",
      dishName: "Heirloom Tomato Salad",
      description: "Local tomatoes with fresh basil, burrata, and aged balsamic.",
      category: "Salads"
    },
    {
      dishId: "dish16",
      dishName: "Herb-Roasted Chicken",
      description: "Free-range chicken with herbs from our garden and pan jus.",
      category: "Mains"
    },
    {
      dishId: "dish17",
      dishName: "Grass-Fed Beef Short Ribs",
      description: "Slow-braised ribs with local root vegetables and red wine.",
      category: "Mains"
    },
    {
      dishId: "dish18",
      dishName: "Roasted Seasonal Vegetables",
      description: "Farm-fresh vegetables roasted with herbs, garlic, and olive oil.",
      category: "Sides"
    },
    {
      dishId: "dish19",
      dishName: "New Potato Salad",
      description: "Warm fingerling potatoes with whole grain mustard and fresh herbs.",
      category: "Sides"
    }
  ],
  "menu4": [
    {
      dishId: "dish20",
      dishName: "Savory Dutch Baby with Smoked Trout & Lemon Crème Fraîche",
      description: "A delicate, puffed pancake cradling silky house-smoked trout, spring herbs, and tangy crème fraîche with lemon zest.",
      category: "Appetizers"
    },
    {
      dishId: "dish21",
      dishName: "Golden Beet Carpaccio with Whipped Goat Cheese & Pistachio Gremolata",
      description: "Thin-sliced roasted beets draped over a cloud of chèvre, topped with a crunchy citrus-herb pistachio sprinkle.",
      category: "Appetizers"
    },
    {
      dishId: "dish22",
      dishName: "Mini Crab Cake Benedicts",
      description: "Lump crab cakes crowned with poached quail eggs and Meyer lemon hollandaise on grilled polenta rounds.",
      category: "Appetizers"
    },
    {
      dishId: "dish23",
      dishName: "Dungeness Crab & Asparagus Frittata",
      description: "Oven-baked eggs, sweet crab, grilled asparagus, and caramelized onion, finished with a touch of tarragon.",
      category: "Mains"
    },
    {
      dishId: "dish24",
      dishName: "Wild Mushroom & Gruyère Bread Pudding",
      description: "Savory custard-soaked brioche folded with roasted mushrooms, melted gruyère, and a kiss of truffle oil.",
      category: "Mains"
    },
    {
      dishId: "dish25",
      dishName: "Chili-Lime Avocado Toast with Poached Eggs & Pickled Shallots",
      description: "Multigrain toast topped with smashed avocado, soft poached eggs, spicy radish, and tangy pickled shallots.",
      category: "Mains"
    },
    {
      dishId: "dish26",
      dishName: "Citrus & Fennel Salad with Mint and Pomegranate",
      description: "Bright and refreshing, with blood orange segments, shaved fennel, and fresh herbs in a champagne vinaigrette.",
      category: "Sides"
    },
    {
      dishId: "dish27",
      dishName: "Sweet Potato Hash with Chorizo & Charred Scallions",
      description: "Crispy diced sweet potatoes tossed with smoky chorizo, scallions, and a dash of sherry vinegar.",
      category: "Sides"
    },
    {
      dishId: "dish28",
      dishName: "Brioche Cinnamon Rolls with Blood Orange Glaze",
      description: "Soft, pull-apart rolls kissed with cardamom and citrus zest, glazed in a vibrant, tangy icing.",
      category: "Sides"
    }
  ]
};