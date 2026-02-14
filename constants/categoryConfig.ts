export const categoryConfig: Record<string, any> = {
    'laptops': {
        title: 'Laptops',
        hero: {
            'Apple': {
                gradient: 'linear-gradient(135deg, #1E0B36 0%, #102B7B 45%, #04D0D9 100%)',
                title: 'MacBook Pro & Air',
                subtitle: 'Performance Refined.',
                desc: 'Power through your workflow with M-series chips. Reused Assured quality.',
                image: '/images/Indian-women-with-apple-laptop.png',
                badge: 'Premium Collection',
                textGradient: 'from-blue-400 to-cyan-400'
            },
            'Dell': {
                gradient: 'linear-gradient(135deg, #021B35 0%, #004E8F 50%, #007DB8 100%)',
                title: 'Dell Latitude & XPS',
                subtitle: 'Built for Business.',
                desc: 'Enterprise-grade durability meets premium design. The perfect choice for professionals.',
                image: '/images/Indian-women-with-Dell-laptop.png',
                badge: 'Business Ready',
                textGradient: 'from-cyan-300 to-blue-200'
            },
            'HP': {
                gradient: 'linear-gradient(135deg, #002D3A 0%, #006D85 50%, #00A6C7 100%)',
                title: 'HP EliteBook & Spectre',
                subtitle: 'Elegance Meets Power.',
                desc: 'Stunning craftsmanship with robust security features for the modern workplace.',
                image: '/images/Indian-women-with-hp-laptop.png',
                badge: 'Elite Performance',
                textGradient: 'from-teal-300 to-emerald-200'
            },
            'Lenovo': {
                gradient: 'linear-gradient(135deg, #0a2e5e 0%, #004E8F 50%, #29abe2 100%)',
                title: 'Lenovo ThinkPad',
                subtitle: 'Legendary Reliability.',
                desc: 'Tested against 12 military-grade requirements. The ultimate tool for productivity.',
                image: '/images/lenovo-hero-image.png',
                badge: 'Pro Series',
                textGradient: 'from-blue-400 to-cyan-300'
            },
            'Default': {
                gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
                title: 'Premium Used Laptops',
                subtitle: 'Performance on the Go.',
                desc: 'Discover our wide range of certified refurbished laptops from top brands like Apple, Dell, HP, and Lenovo.',
                image: '/images/girl-holding-laptop.png',
                badge: 'Reused Assured',
                textGradient: 'from-blue-300 to-cyan-300'
            }
        },
        filters: [
            {
                id: 'price',
                label: 'Price',
                options: ['Under ₹20,000', '₹20,000 - ₹40,000', '₹40,000 - ₹60,000', 'Above ₹60,000']
            },
            {
                id: 'brand',
                label: 'Brand',
                options: ['Apple', 'Dell', 'HP', 'Lenovo']
            },
            {
                id: 'processor',
                label: 'Processor',
                options: ['Intel Core i5', 'Intel Core i7', 'Apple M1/M2', 'AMD Ryzen']
            },
            {
                id: 'ram',
                label: 'RAM',
                options: ['8GB', '16GB', '32GB+']
            },
            {
                id: 'storage',
                label: 'Storage',
                options: ['256GB SSD', '512GB SSD', '1TB SSD']
            }
        ]
    },
    'desktops': {
        title: 'Desktops',
        hero: {
            'Apple': {
                gradient: 'linear-gradient(135deg, #1E0B36 0%, #102B7B 45%, #04D0D9 100%)',
                title: 'iMac & Mac Mini',
                subtitle: 'Powerfully Simple.',
                desc: 'Transform your workspace with the ultimate all-in-one desktop experience.',
                image: '/images/hero-desktops.png',
                badge: 'Premium Desktop',
                textGradient: 'from-blue-400 to-cyan-400'
            },
            'Dell': {
                gradient: 'linear-gradient(135deg, #021B35 0%, #004E8F 50%, #007DB8 100%)',
                title: 'Dell OptiPlex & Inspiron',
                subtitle: 'Productivity Powerhouse.',
                desc: 'Reliable performance for home and office. Built to last.',
                image: '/images/hero-desktops.png',
                badge: 'Business Ready',
                textGradient: 'from-cyan-300 to-blue-200'
            },
            'HP': {
                gradient: 'linear-gradient(135deg, #002D3A 0%, #006D85 50%, #00A6C7 100%)',
                title: 'HP EliteDesk & Pavilion',
                subtitle: 'Engineered for Excellence.',
                desc: 'Sleek designs with powerful performance for every task.',
                image: '/images/hero-desktops.png',
                badge: 'Elite Performance',
                textGradient: 'from-teal-300 to-emerald-200'
            },
            'Lenovo': {
                gradient: 'linear-gradient(135deg, #0a2e5e 0%, #004E8F 50%, #29abe2 100%)',
                title: 'Lenovo ThinkCentre',
                subtitle: 'Tiny Footprint, Big Performance.',
                desc: 'Compact and powerful desktops designed for modern workspaces.',
                image: '/images/hero-desktops.png',
                badge: 'Pro Series',
                textGradient: 'from-blue-400 to-cyan-300'
            },
            'Default': {
                gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
                title: 'Premium Used Desktops',
                subtitle: 'Performance for Every Need.',
                desc: 'Discover our wide range of certified refurbished desktops from top brands like Dell, HP, and Lenovo.',
                image: '/images/girl-holding-desktops.png',
                badge: 'Reused Assured',
                textGradient: 'from-blue-300 to-cyan-300'
            }
        },
        filters: [
            {
                id: 'price',
                label: 'Price',
                options: ['Under ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹80,000', 'Above ₹80,000']
            },
            {
                id: 'brand',
                label: 'Brand',
                options: ['Apple', 'Dell', 'HP', 'Lenovo']
            },
            {
                id: 'formFactor',
                label: 'Form Factor',
                options: ['All-in-One (AIO)', 'Tower Desktop', 'Mini PC']
            },
            {
                id: 'processor',
                label: 'Processor',
                options: ['Intel Core i5', 'Intel Core i7', 'Apple M1/M2', 'AMD Ryzen']
            },
            {
                id: 'ram',
                label: 'RAM',
                options: ['8GB', '16GB', '32GB+']
            }
        ]
    },
    'monitors': {
        title: 'Monitors',
        hero: {
            'Dell': {
                gradient: 'linear-gradient(135deg, #021B35 0%, #004E8F 50%, #007DB8 100%)',
                title: 'Dell UltraSharp & P-Series',
                subtitle: 'Details That Pop.',
                desc: 'Experience vibrant colors and sharp details with Dell\'s premium monitors.',
                image: '/images/hero-monitors.png',
                badge: 'Professional Grade',
                textGradient: 'from-cyan-300 to-blue-200'
            },
            'HP': {
                gradient: 'linear-gradient(135deg, #002D3A 0%, #006D85 50%, #00A6C7 100%)',
                title: 'HP E-Series & ProDisplay',
                subtitle: 'Comfort & Clarity.',
                desc: 'Ergonomic designs with eye-ease technology for long work hours.',
                image: '/images/hero-monitors.png',
                badge: 'Business Ready',
                textGradient: 'from-teal-300 to-emerald-200'
            },
            'LG': {
                gradient: 'linear-gradient(135deg, #0a2e5e 0%, #004E8F 50%, #29abe2 100%)',
                title: 'LG UltraGear & UltraWide',
                subtitle: 'Expand Your View.',
                desc: 'Immersive ultrawide displays and high-refresh gaming monitors.',
                image: '/images/hero-monitors.png',
                badge: 'Innovation Leader',
                textGradient: 'from-blue-400 to-cyan-300'
            },
            'Samsung': {
                gradient: 'linear-gradient(135deg, #030F2B 0%, #1428A0 50%, #2979FF 100%)',
                title: 'Samsung Odyssey & Smart',
                subtitle: 'The Future of Gaming.',
                desc: 'Curved displays and smart features that redefine your visual experience.',
                image: '/images/hero-monitors.png',
                badge: 'Visual Masterpiece',
                textGradient: 'from-blue-400 to-indigo-300'
            },
            'BenQ': {
                gradient: 'linear-gradient(135deg, #1A0524 0%, #4A148C 50%, #7B1FA2 100%)',
                title: 'BenQ Mobiuz & PD Series',
                subtitle: 'Color Accuracy Matters.',
                desc: 'Designed for designers and gamers who demand precise colors.',
                image: '/images/hero-monitors.png',
                badge: 'Designer\'s Choice',
                textGradient: 'from-purple-400 to-fuchsia-300'
            },
            'Acer': {
                gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
                title: 'Acer Predator & Nitro',
                subtitle: 'Speed Unleashed.',
                desc: 'High refresh rates and low response times for competitive gaming.',
                image: '/images/hero-monitors.png',
                badge: 'Gaming Beast',
                textGradient: 'from-green-400 to-teal-300'
            },
            'Default': {
                gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
                title: 'Crystal Clear Displays',
                subtitle: 'Upgrade Your View.',
                desc: 'Explore our wide selection of certified refurbished monitors from top brands.',
                image: '/images/girl-holding-monitor.png',
                badge: 'Reused Assured',
                textGradient: 'from-blue-300 to-cyan-300'
            }
        },
        filters: [
            {
                id: 'price',
                label: 'Price',
                options: ['Under ₹10,000', '₹10,000 - ₹20,000', '₹20,000 - ₹40,000', 'Above ₹40,000']
            },
            {
                id: 'brand',
                label: 'Brand',
                options: ['Dell', 'HP', 'LG', 'Samsung', 'BenQ', 'Acer']
            },
            {
                id: 'screenSize',
                label: 'Screen Size',
                options: ['21" - 24"', '25" - 27"', '28" - 32"', '34"+ (Ultrawide)']
            },
            {
                id: 'resolution',
                label: 'Resolution',
                options: ['Full HD (1080p)', '2K (1440p)', '4K UHD']
            },
            {
                id: 'refreshRate',
                label: 'Refresh Rate',
                options: ['60Hz - 75Hz', '144Hz', '165Hz+']
            }
        ]
    },
    'accessories': {
        title: 'Accessories',
        hero: {
            'Default': {
                gradient: 'linear-gradient(135deg, #1A1A1A 0%, #363636 50%, #4A4A4A 100%)',
                title: 'Essential Accessories',
                subtitle: 'Complete Your Setup.',
                desc: 'Keyboards, Mice, Cables, and more to enhance your computing experience.',
                image: '/images/hero-accessories.png', // Placeholder, verify existence
                badge: 'Reused Essentials',
                textGradient: 'from-gray-300 to-gray-100'
            }
        },
        filters: [
            {
                id: 'price',
                label: 'Price',
                options: ['Under ₹500', '₹500 - ₹1,000', '₹1,000 - ₹2,000', 'Above ₹2,000']
            },
            {
                id: 'category',
                label: 'Category',
                options: ['Keyboard', 'Mouse', 'Cable', 'Adapter', 'Bag']
            }
        ]
    }
};
