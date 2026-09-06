import { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
    personal: {
        name: 'Arham Topiwala',
        title: 'Full Stack Web Developer',
        subtitle: 'Full Stack Web Developer | Scalable Applications | RESTful API Integrations | Performance Optimization',
        bio: 'Full Stack Web Development professional with 2 years of experience in web design and development and data management & systems. Expert in RESTful API integrations and responsive UI engineering. Key achievements include improving page load speed by 38% through performance tuning routines and code optimizations, and increasing data accuracy to 99.6% by implementing standardized verification protocols. Seeking a Full Stack Web Developer position at a company where I bring my web design and development and data management & systems skills to support your mission of architecting scalable web applications and modular backend systems.',
        avatar: '/about/arfazrll.webp',
        location: 'Ahmedabad, Gujarat',
        email: 'topiwalaarham07@gmail.com',
        phone: '+91-95129 59909',
        resumeUrl: '/resume',
        website: 'https://github.com/Arham43-ops',
        languages: [
            { name: 'English', level: 'Native' }
        ],
        socialLinks: [
            {
                platform: 'GitHub',
                url: 'https://github.com/Arham43-ops',
                icon: 'github',
                username: 'Arham43-ops',
            },
            {
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/arham',
                icon: 'linkedin',
                username: 'arham',
            },
            {
                platform: 'Instagram',
                url: 'https://www.instagram.com/wanderlust._.43/',
                icon: 'instagram',
                username: 'wanderlust._.43',
            },
        ],
    },
    projects: [
        {
            id: 'project-1',
            slug: 'ai-driven-web-application-platform',
            title: 'AI-Driven Web Application Platform',
            description: 'Full-stack web application leveraging Node.js and LLM API integrations to process dynamic prompt requests and yield real-time data visualisations.',
            longDescription: 'Developed a full-stack web application leveraging Node.js and LLM API integrations to process dynamic prompt requests and yield real-time data visualisations. Containerized frontend assets were deployed onto Netlify with automated CI/CD build triggers from GitHub repository commits.',
            techStack: ['JavaScript', 'TypeScript', 'Node.js', 'Express.js', 'React.js', 'LLM API Integration', 'Docker', 'Netlify', 'CI/CD'],
            tools: ['VS Code', 'GitHub', 'Postman', 'Docker', 'npm'],
            status: 'completed',
            repoUrl: 'https://github.com/Arham43-ops',
            demoUrl: '#',
            startDate: '2025-01-01',
            role: 'Full Stack Web Developer',
            customTimeline: 'Jan 2025 - Present',
            team: 'Personal Portfolio Project',
            highlights: ['Real-Time Data Visualisations', 'LLM API Integrations', 'Containerized Netlify Deployment', 'Automated CI/CD Triggers'],
            category: 'Full Stack & AI Integration',
            features: [
                {
                    title: 'Core Capabilities',
                    items: [
                        '**Dynamic LLM Processing**: Integrated Node.js backend with LLM APIs to handle dynamic user prompts and automated data extraction.',
                        '**Real-Time Visualisations**: Custom React charts and rendering pipeline to yield real-time data insights.',
                        '**Automated CI/CD Deployment**: Deployed containerized assets to Netlify with automatic build triggers from GitHub commits.'
                    ]
                }
            ],
            challengesAndSolutions: [
                {
                    problem: 'Handling Latency in LLM Data Extractions',
                    solution: 'Implemented asynchronous processing queues and streaming endpoints in Node.js for smooth user experience.'
                },
                {
                    problem: 'Containerized Deployment Automation',
                    solution: 'Configured Docker container fundamentals and GitHub Actions CI/CD pipeline targeting Netlify build targets.'
                }
            ]
        }
    ],
    experiences: [
        {
            id: 'prof-1',
            company: 'ICAT Internship Studio',
            position: 'Web Design and Development Intern',
            description: 'Architecting responsive web application interfaces using JavaScript, React, and CSS3, engineering modular RESTful API endpoints, and accelerating page load velocities by 38%.',
            responsibilities: [
                'Architect responsive web application interfaces using JavaScript, React, and CSS3 to elevate user experience across multi-platform devices',
                'Engineer modular RESTful API endpoints and backend communication layers, ensuring low-latency data rendering and cross-browser stability',
                'Implement performance tuning routines, image optimizations, and code splitting, accelerating page load velocities by 38%',
                'Audit frontend codebases for WCAG accessibility compliance and security standards, decreasing interface diagnostic bugs by 29%',
                'Collaborate with UI/UX designers and senior developers in Agile sprint cycles to deliver client-ready software features on strict deadlines'
            ],
            skills: ['JavaScript', 'React.js', 'CSS3', 'RESTful APIs', 'Performance Optimization', 'WCAG Accessibility', 'Agile/Scrum'],
            startDate: '2025-10-01',
            endDate: '2026-02-01',
            isOngoing: false,
            location: 'Remote / Hybrid',
            type: 'internship',
            logo: '/experience/icat-logo.png',
        },
        {
            id: 'prof-2',
            company: 'Injala Pvt. Ltd',
            position: 'Data Management & Systems Specialist (Contract)',
            description: 'Executing large-scale data ingestion and automated validation workflows, elevating data accuracy rates to 99.6% across enterprise databases.',
            responsibilities: [
                'Executed large-scale data ingestion and automated validation workflows to support high-integrity business analytics and operational reporting',
                'Cleaned and structured unstructured datasets using automated validation scripts, accelerating operational processing times by 34%',
                'Implemented standardized data verification protocols across high-volume enterprise databases, elevating data accuracy rates to 99.6%',
                'Drafted technical data dictionaries and workflow documentation to ensure team alignment and seamless cross-functional data retrieval'
            ],
            skills: ['Data Management', 'PostgreSQL', 'SQL', 'Data Cleansing', 'ETL Processing', 'Bulk Data Verification'],
            startDate: '2025-07-01',
            endDate: '2025-08-01',
            isOngoing: false,
            location: 'Ahmedabad, India',
            type: 'contract',
            logo: '/experience/injala-logo.png',
        },
        {
            id: 'prof-3',
            company: 'Genuine Bags',
            position: 'E-Commerce Operations & Digital Platforms Specialist',
            description: 'Overhauling end-to-end e-commerce platform workflows, redesigning product catalogs, driving 24% conversion rate boosts, and automating stock reconciliations saving CAD $18K annually.',
            responsibilities: [
                'Overhauled end-to-end e-commerce platform workflows, overseeing product catalog deployment, inventory synchronization, and digital order processing',
                'Redesigned digital product catalogs and search metadata architectures, expanding web traffic visibility and driving customer conversion rates up by 24%',
                'Automated stock level reconciliations and customer response channels, saving approximately CAD $18K in operational overhead annually',
                'Directed digital content updates across third-party marketplaces, ensuring uniform branding and uninterrupted platform uptime'
            ],
            skills: ['E-Commerce Platforms', 'Metadata Architecture', 'Automation Scripts', 'Inventory Optimization', 'Digital Operations'],
            startDate: '2024-06-01',
            endDate: '2025-07-01',
            isOngoing: false,
            location: 'Ahmedabad, India',
            type: 'full-time',
            logo: '/experience/genuine-bags-storefront.png',
        }
    ],
    education: [
        {
            id: 'edu-1',
            institution: 'L. J. University',
            degree: 'Bachelor of Science',
            major: 'Information Technology (BSc IT)',
            startDate: '2023-08-01',
            endDate: '2026-06-01',
            isOngoing: false,
            gpa: '6.5/8',
            location: 'Ahmedabad, India',
            activities: ['Web Development Engineering', 'Database Schema & Query Optimization', 'RESTful API Labs'],
            achievements: [
                'Specialized in Full Stack Web Development and Data Systems',
                'Engineered modular backend & responsive UI projects'
            ],
        }
    ],
    achievements: [
        {
            id: 'ach-1',
            title: 'Enhanced Performance',
            issuer: 'ICAT Internship Studio',
            date: '2026-02-01',
            description: 'Improved page load speed by 38% through performance tuning routines and code optimizations.',
            category: 'award',
        },
        {
            id: 'ach-2',
            title: 'Data Accuracy Improvement',
            issuer: 'Injala Pvt. Ltd',
            date: '2025-10-01',
            description: 'Increased data accuracy to 99.6% by implementing standardized verification protocols.',
            category: 'award',
        },
        {
            id: 'ach-3',
            title: 'Conversion Rate Boost',
            issuer: 'Genuine Bags',
            date: '2025-07-01',
            description: 'Boosted customer conversion rates by 24% with redesigned digital catalogs and metadata.',
            category: 'award',
        },
        {
            id: 'ach-4',
            title: 'Cost Reduction Achievement',
            issuer: 'Genuine Bags',
            date: '2025-07-01',
            description: 'Saved CAD $18K annually by automating stock reconciliations and customer response channels.',
            category: 'award',
        }
    ],
    techStack: [
        { name: 'JavaScript (ES6+)', icon: 'https://cdn.simpleicons.org/javascript', category: 'language' },
        { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', category: 'language' },
        { name: 'HTML5', icon: 'https://cdn.simpleicons.org/html5', category: 'language' },
        { name: 'CSS3', icon: 'https://cdn.simpleicons.org/css3', category: 'language' },
        { name: 'Python', icon: 'https://cdn.simpleicons.org/python', category: 'language' },
        { name: 'SQL', icon: 'https://cdn.simpleicons.org/sqlite', category: 'language' },
        { name: 'React.js', icon: 'https://cdn.simpleicons.org/react', category: 'framework' },
        { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs', category: 'framework' },
        { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs', category: 'framework' },
        { name: 'Express.js', icon: 'https://cdn.simpleicons.org/express', category: 'framework' },
        { name: 'TailWind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss', category: 'library' },
        { name: 'Bootstrap', icon: 'https://cdn.simpleicons.org/bootstrap', category: 'library' },
        { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql', category: 'database' },
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql', category: 'database' },
        { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb', category: 'database' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'tool' },
        { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel', category: 'cloud' },
        { name: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify', category: 'cloud' },
    ],
    hardSkills: [
        { name: 'Full Stack Web Development', level: 'expert', category: 'software', description: '2 years of experience in web design, responsive UI engineering, and data management systems.' },
        { name: 'RESTful API Integrations', level: 'expert', category: 'software', description: 'Engineering modular RESTful API endpoints and backend communication layers for low latency.' },
        { name: 'Web Performance Optimization', level: 'expert', category: 'software', description: 'Accelerating page load speed by 38% via code splitting, image optimizations, and performance tuning.' },
        { name: 'Database Management & Schema Design', level: 'advanced', category: 'data', description: 'Designing relational & NoSQL database schemas in MySQL, PostgreSQL, and MongoDB with query optimization.' },
        { name: 'Data Cleansing & ETL Processing', level: 'advanced', category: 'data', description: 'Bulk data verification, automated validation scripts, and data pipeline accuracy up to 99.6%.' },
        { name: 'AI & Machine Learning Integration', level: 'intermediate', category: 'ai', description: 'LLM API integration, OpenAI APIs, prompt engineering, and automated data extraction.' },
        { name: 'Cloud & DevOps', level: 'intermediate', category: 'devops', description: 'Deploying application assets on Vercel/Netlify, Docker container fundamentals, AWS S3 basics, and CI/CD pipelines.' },
        { name: 'WCAG Accessibility & Security Standards', level: 'advanced', category: 'software', description: 'Auditing codebases for WCAG compliance, cross-browser compatibility, and CORS standards.' }
    ],
    softSkills: [
        { name: 'Problem Solving', description: 'Efficient debugging, performance tuning, and architectural troubleshooting' },
        { name: 'Agile / Scrum Methodologies', description: 'Iterative sprint cycles, code reviews, and collaborative development' },
        { name: 'Technical Documentation', description: 'Drafting data dictionaries, API specifications, and workflow documentation' },
        { name: 'Cross-Browser Stability & UX', description: 'Ensuring seamless user experiences across multi-platform devices' },
        { name: 'Data Accuracy & Verification', description: 'Rigorous validation protocols and enterprise data management' }
    ],
    tools: [
        { name: 'VS Code', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', category: 'ide' },
        { name: 'Git', icon: 'https://cdn.simpleicons.org/git', category: 'devops' },
        { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', category: 'devops' },
        { name: 'Postman', icon: 'https://cdn.simpleicons.org/postman', category: 'devops' },
        { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker', category: 'devops' },
        { name: 'npm/yarn', icon: 'https://cdn.simpleicons.org/npm', category: 'productivity' },
        { name: 'Webpack', icon: 'https://cdn.simpleicons.org/webpack', category: 'devops' },
    ],
    faqs: [
        {
            question: 'What services do you offer?',
            answer: 'I specialize in Full Stack Web Development (React.js, Next.js, Node.js, Express.js), RESTful API Engineering, Performance Optimization, Database Management (MySQL, PostgreSQL, MongoDB), and AI LLM API Integrations.',
        },
        {
            question: 'What key achievements do you bring to engineering teams?',
            answer: 'I have proven results including a 38% improvement in page load speed through performance tuning, raising database data accuracy to 99.6%, boosting customer conversion rates by 24%, and saving CAD $18K annually through process automation.',
        },
        {
            question: 'Are you available for positions or collaborations?',
            answer: 'Yes! I am seeking Full Stack Web Developer roles, remote/hybrid contracts, and software engineering opportunities. Feel free to connect!',
        },
    ],
    blogs: [
        {
            id: 'blog-1',
            slug: 'optimizing-web-performance-38-percent-boost',
            title: 'Accelerating Page Load Velocities by 38%: A Performance Engineering Guide',
            excerpt: 'How code splitting, image optimization, and performance tuning routines drastically improve Core Web Vitals.',
            content: 'Detailed techniques for web performance optimization...',
            image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-02-15',
            category: 'software-development',
            tags: ['Performance', 'React', 'Optimization', 'Web Vitals'],
            author: { name: 'Arham Topiwala', avatar: '/about/arfazrll.webp' },
            readTime: '5'
        },
        {
            id: 'blog-2',
            slug: 'building-scalable-rest-apis-nodejs',
            title: 'Architecting Scalable RESTful API Layers in Node.js & Express',
            excerpt: 'Best practices for low-latency data rendering, error handling, and CORS compliance in modern web apps.',
            content: 'API architecture best practices...',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop&fm=webp',
            date: '2026-01-20',
            category: 'software-development',
            tags: ['Node.js', 'Express', 'REST API', 'Backend'],
            author: { name: 'Arham Topiwala', avatar: '/about/arfazrll.webp' },
            readTime: '6'
        }
    ],
    gallery: [
        {
            id: 'gal-1',
            title: 'Web Application Architecture',
            description: 'Designing modular RESTful APIs and responsive React frontends.',
            date: '2026-02-01',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'technical'
        },
        {
            id: 'gal-2',
            title: 'Database & Data Validation Workflows',
            description: 'Automated data verification protocols achieving 99.6% data accuracy.',
            date: '2025-10-15',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop&fm=webp',
            category: 'technical'
        }
    ]
};
