import mongoose from 'mongoose';
import User from '../models/User';
import Destination from '../models/Destination';
import Post from '../models/Post';
import Comment from '../models/Comment';

export const seedDatabase = async (): Promise<void> => {
  try {
    const destCount = await Destination.countDocuments();
    if (destCount > 0) {
      console.log('Database already has destination data. Skipping seeding...');
      return;
    }

    console.log('Seeding database with realistic travel tales & reviews...');

    // 1. Create Users
    const admin = new User({
      name: 'Aditya Sharma',
      email: 'admin@traveltales.in',
      password: 'adminpassword123',
      bio: 'Chief curator and administrator at TravelTales India. Chronicling remote paths from the Himalayas to the Indian Ocean.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=aditya',
      role: 'admin',
    });
    await admin.save();

    const user1 = new User({
      name: 'Priya Patel',
      email: 'priya@traveltales.in',
      password: 'password123',
      bio: 'Solo traveler, landscape photographer, and chai lover. Exploring the length and breadth of India one train journey at a time.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya',
      role: 'user',
    });
    await user1.save();

    const user2 = new User({
      name: 'Rohan Sen',
      email: 'rohan@traveltales.in',
      password: 'password123',
      bio: 'Enthusiastic trekker, food blogger, and historian. Seeking out ancient architectural wonders and street food lanes.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rohan',
      role: 'user',
    });
    await user2.save();

    // 2. Create Destinations
    const d1 = new Destination({
      name: 'Munnar Tea Hills',
      state: 'Kerala',
      city: 'Munnar',
      coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200',
      description: 'Munnar is a stunningly beautiful hill station in Kerala, famous for its lush tea plantations, mist-covered hills, winding paths, and pristine valleys.',
      bestSeason: 'September to May',
      coordinates: { lat: 10.0889, lng: 77.0595 },
    });
    await d1.save();

    const d2 = new Destination({
      name: 'Jaisalmer Sand Dunes',
      state: 'Rajasthan',
      city: 'Jaisalmer',
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200',
      description: 'The Golden City of Jaisalmer rises out of the Thar Desert like a sand castle. Explore the living sandstone fort, dune camping, and camel safaris.',
      bestSeason: 'October to March',
      coordinates: { lat: 26.9157, lng: 70.9083 },
    });
    await d2.save();

    const d3 = new Destination({
      name: 'Hampi Ruins',
      state: 'Karnataka',
      city: 'Hampi',
      coverImage: 'https://images.unsplash.com/photo-1600100397608-f010e47fa185?q=80&w=1200',
      description: 'A UNESCO World Heritage Site, Hampi is a historical wonderland of boulder-strewn landscapes and ancient temple ruins from the Vijayanagara Empire.',
      bestSeason: 'November to February',
      coordinates: { lat: 15.3350, lng: 76.4600 },
    });
    await d3.save();

    const d4 = new Destination({
      name: 'Pangong Alpine Lake',
      state: 'Ladakh',
      city: 'Leh',
      coverImage: 'https://images.unsplash.com/photo-1597079910443-60c43fc4f729?q=80&w=1200',
      description: 'Ladakh is a high-altitude desert region in northern India, renowned for its dramatic barren mountains, turquoise alpine lakes, and ancient Buddhist monasteries.',
      bestSeason: 'June to September',
      coordinates: { lat: 34.1526, lng: 77.5770 },
    });
    await d4.save();

    // 3. Create Posts (Vlogs/Blogs)
    const p1 = new Post({
      title: 'The Magic of Tea Gardens: A 3-Day Guide to Munnar',
      slug: 'magic-tea-gardens-munnar',
      description: 'A detailed slow-travel guide to Munnar, Kerala, covering budget house stays, tea plantation hikes, and catching the morning mist.',
      content: `Munnar, tucked away in the Western Ghats of Kerala, is a paradise of endless green. This 3-day itinerary takes you through the best spots.

### Day 1: The Heart of the Estate
Stroll through Lockhart Tea Museum, witness the tea processing methods, and sample premium black tea. In the afternoon, hike up the tea gardens behind Lockhart Gap. The hills are perfectly manicured, and the air smells like fresh tea leaves.

### Day 2: Above the Clouds
Wake up early at 4:30 AM to take a Jeep safari to Kolukkumalai, the highest organic tea estate in the world. Watching the sunrise from above a sea of mist is an experience that will stay with you forever.

### Day 3: The Reservoir Route
Rent a scooter and drive towards Mattupetty Dam and Kundala Lake. Make stops along the way to click waterfalls and interact with local vendors serving hot chai and spiced pineapples.

**Pro-Tip:** Buy homemade cardamom-flavored chocolates and CTC dust tea locally rather than at tourist centers!`,
      images: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600'
      ],
      destination: d1._id,
      state: d1.state,
      city: d1.city,
      author: user1._id,
      likes: [user2._id, admin._id],
      tags: ['tea-gardens', 'hills', 'scenic', 'kerala', 'backpacking'],
    });
    await p1.save();

    const p2 = new Post({
      title: 'Stargazing and Camel Safaris in the Thar Desert',
      slug: 'stargazing-camel-safaris-thar',
      description: 'Camping under the open desert skies of Rajasthan. A guide to camel safaris, Rajasthani folk music, and Sam Sand Dunes.',
      content: `There is something deeply poetic about the golden sands of Thar. We started our desert exploration from Jaisalmer fort in an open-air 4x4.

### The Safari
By late afternoon, we swapped our jeeps for camel rides. Riding over the ripples of the Sam Sand Dunes during sunset is the quintessential desert experience. The dunes glow bright amber, fading to a deep, dark violet as dusk settles.

### Cultural Night & Feast
We checked into a traditional desert camp. The night began with Manganiyar musicians singing soulful desert folk songs, followed by energetic Kalbelia dances around a bonfire. For dinner, we were served hot Dal Baati Churma cooked in pure ghee.

### Sleeping Under the Stars
Rather than staying inside tents, we requested the staff to place our cots on the open dunes. Sleeping directly under the Milky Way with the cool desert breeze was magical. Make sure to carry thick woolens as temperatures drop rapidly!`,
      images: [
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200'
      ],
      destination: d2._id,
      state: d2.state,
      city: d2.city,
      author: user1._id,
      likes: [admin._id],
      tags: ['desert', 'camping', 'rajasthan', 'stargazing', 'folk-music'],
    });
    await p2.save();

    const p3 = new Post({
      title: 'Bicycles and Stone Chariots: Exploring the Ruins of Hampi',
      slug: 'bicycles-stone-chariots-hampi',
      description: 'Exploring the ancient architectural marvels of the Vijayanagara Empire on a bicycle.',
      content: `Hampi looks like a giant playground designed by gods. Thousands of massive granite boulders lie piled across the landscape, housing ancient temple structures that have stood for centuries.

### Exploring on Two Wheels
We rented a bicycle near Hampi Bazaar for just Rs. 150 a day. The terrain is flat, making it ideal for cycling. Our first stop was the Virupaksha Temple, dedicated to Lord Shiva, which has been actively worshiped in since the 7th century.

### Architectural Marvels
Next, we headed to the Vittala Temple complex, home to the famous Stone Chariot. The musical pillars here, which sound like drums when tapped, are an engineering marvel of the 16th century.

### Sunset at Hemakuta Hill
We ended our day on Hemakuta Hill. Listening to a local flutist playing ragas as the sun dipped below the boulder-strewn horizon was a surreal, meditative experience.`,
      images: [
        'https://images.unsplash.com/photo-1600100397608-f010e47fa185?q=80&w=1200'
      ],
      destination: d3._id,
      state: d3.state,
      city: d3.city,
      author: admin._id,
      likes: [user1._id, user2._id],
      tags: ['heritage', 'ruins', 'history', 'architecture', 'karnataka'],
    });
    await p3.save();

    const p4 = new Post({
      title: 'Road Tripping to Pangong: Crossing the World\'s Highest Passes',
      slug: 'road-tripping-pangong-lake',
      description: 'A comprehensive travelogue on driving to Ladakh, acclimatizing in Leh, and visiting the stunning Pangong Lake.',
      content: `Ladakh is not just a destination; it is a pilgrimage for road trippers. The journey from Leh to Pangong Tso involves traversing rugged terrains and steep curves.

### Crossing Chang La
At an elevation of 17,590 feet, Chang La pass is one of the highest motorable roads in the world. The pass is perpetually snow-clad, and we stopped briefly to grab hot Maggi and ginger tea from the army canteen.

### The First Sight of Pangong
As you descend into the Changthang valley, the barren landscape opens up, and a sliver of brilliant blue appears in the distance. Pangong Lake is a 134-km long endorheic lake extending from India to Tibet. The water changes colors from turquoise to deep navy depending on the sunlight.

**Crucial Tips:**
1. Spend at least 2 full days in Leh town to acclimatize to the thin air before heading to high altitudes.
2. Carry portable oxygen cylinders and keep drinking water frequently to prevent AMS (Acute Mountain Sickness).`,
      images: [
        'https://images.unsplash.com/photo-1597079910443-60c43fc4f729?q=80&w=1200'
      ],
      destination: d4._id,
      state: d4.state,
      city: d4.city,
      author: user2._id,
      likes: [user1._id],
      tags: ['road-trip', 'ladakh', 'lakes', 'adventure', 'himalayas'],
    });
    await p4.save();

    // 4. Create Comments (Reviews)
    const c1 = new Comment({
      text: 'This is an excellent breakdown, Priya! Your tip about Lockhart tea plucking was spot on. Highly recommend the Kolukkumalai safari to everyone.',
      postId: p1._id,
      userId: user2._id,
    });
    await c1.save();
    p1.comments.push(c1._id as any);
    await p1.save();

    const c2 = new Comment({
      text: 'Wow, sleeping on open-air cots on the dunes sounds incredible. Adding Jaisalmer to my winter itinerary right away!',
      postId: p2._id,
      userId: admin._id,
    });
    await c2.save();
    p2.comments.push(c2._id as any);
    await p2.save();

    const c3 = new Comment({
      text: 'Excellent history log, Aditya. The Virupaksha temple really holds an ancient vibe. Beautiful photography!',
      postId: p3._id,
      userId: user1._id,
    });
    await c3.save();
    p3.comments.push(c3._id as any);
    await p3.save();

    console.log('Database seeded successfully with 3 users, 4 destinations, 4 posts, and 3 comments.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
