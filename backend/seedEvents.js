const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const events = [
  {
    type: 'wedding',
    name: 'Luxury Wedding Package',
    description: 'Experience the wedding of your dreams with our premium wedding package.',
    packages: [
      {
        name: 'Basic Wedding Package',
        price: 500000,
        capacity: 100,
        duration: '1 Day',
        features: [
          'Venue decoration',
          'Basic catering',
          'Photography',
          'Basic entertainment'
        ]
      },
      {
        name: 'Premium Wedding Package',
        price: 750000,
        capacity: 200,
        duration: '2 Days',
        features: [
          'Luxury venue decoration',
          'Premium catering',
          'Professional photography & videography',
          'Live entertainment',
          'Wedding planner'
        ]
      },
      {
        name: 'Royal Wedding Package',
        price: 1000000,
        capacity: 500,
        duration: '3 Days',
        features: [
          'Royal venue decoration',
          '5-star catering',
          'Professional photography & videography',
          'Live entertainment & DJ',
          'Wedding planner',
          'Luxury transportation'
        ]
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80'
    ]
  },
  {
    type: 'corporate',
    name: 'Corporate Event Package',
    description: 'Professional corporate event solutions for your business needs.',
    packages: [
      {
        name: 'Basic Corporate Package',
        price: 500000,
        capacity: 50,
        duration: '1 Day',
        features: [
          'Conference room setup',
          'Basic AV equipment',
          'Refreshments',
          'Basic decoration'
        ]
      },
      {
        name: 'Premium Corporate Package',
        price: 750000,
        capacity: 100,
        duration: '2 Days',
        features: [
          'Premium conference setup',
          'Advanced AV equipment',
          'Full catering service',
          'Professional decoration',
          'Event coordinator'
        ]
      },
      {
        name: 'Executive Corporate Package',
        price: 1000000,
        capacity: 200,
        duration: '3 Days',
        features: [
          'Executive conference setup',
          'State-of-the-art AV equipment',
          'Premium catering',
          'Luxury decoration',
          'Dedicated event manager',
          'Transportation service'
        ]
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80'
    ]
  },
  {
    type: 'birthday',
    name: 'Birthday Celebration Package',
    description: 'Make your birthday special with our customized celebration packages.',
    packages: [
      {
        name: 'Basic Birthday Package',
        price: 500000,
        capacity: 30,
        duration: '1 Day',
        features: [
          'Venue decoration',
          'Basic catering',
          'Birthday cake',
          'Basic entertainment'
        ]
      },
      {
        name: 'Premium Birthday Package',
        price: 750000,
        capacity: 50,
        duration: '1 Day',
        features: [
          'Theme decoration',
          'Premium catering',
          'Custom birthday cake',
          'Entertainment & activities',
          'Party planner'
        ]
      },
      {
        name: 'Luxury Birthday Package',
        price: 1000000,
        capacity: 100,
        duration: '2 Days',
        features: [
          'Luxury theme decoration',
          '5-star catering',
          'Premium birthday cake',
          'Live entertainment',
          'Party planner',
          'Photo booth'
        ]
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80'
    ]
  },
  {
    type: 'anniversary',
    name: 'Anniversary Celebration Package',
    description: 'Celebrate your special day with our romantic anniversary packages.',
    packages: [
      {
        name: 'Basic Anniversary Package',
        price: 500000,
        capacity: 20,
        duration: '1 Day',
        features: [
          'Romantic decoration',
          'Basic catering',
          'Anniversary cake',
          'Basic entertainment'
        ]
      },
      {
        name: 'Premium Anniversary Package',
        price: 750000,
        capacity: 30,
        duration: '1 Day',
        features: [
          'Luxury decoration',
          'Premium catering',
          'Custom anniversary cake',
          'Live entertainment',
          'Event coordinator'
        ]
      },
      {
        name: 'Royal Anniversary Package',
        price: 1000000,
        capacity: 50,
        duration: '2 Days',
        features: [
          'Royal decoration',
          '5-star catering',
          'Premium anniversary cake',
          'Live entertainment',
          'Event planner',
          'Photography & videography'
        ]
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80'
    ]
  },
  {
    type: 'other',
    name: 'Custom Event Package',
    description: 'Tailored packages for your unique celebration needs.',
    packages: [
      {
        name: 'Basic Custom Package',
        price: 500000,
        capacity: 30,
        duration: '1 Day',
        features: [
          'Basic decoration',
          'Basic catering',
          'Basic entertainment',
          'Event coordination'
        ]
      },
      {
        name: 'Premium Custom Package',
        price: 750000,
        capacity: 50,
        duration: '1 Day',
        features: [
          'Premium decoration',
          'Premium catering',
          'Entertainment options',
          'Event planner',
          'Custom theme'
        ]
      },
      {
        name: 'Luxury Custom Package',
        price: 1000000,
        capacity: 100,
        duration: '2 Days',
        features: [
          'Luxury decoration',
          '5-star catering',
          'Premium entertainment',
          'Dedicated event manager',
          'Custom theme',
          'Photography & videography'
        ]
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80'
    ]
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log('Events seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents(); 