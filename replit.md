# Celecart - Celebrity Fashion Discovery Platform

## Overview
Celecart is a cutting-edge web and mobile platform designed to revolutionize fashion discovery. It leverages interactive, AI-powered personalized style exploration and dynamic visual content to showcase celebrity fashion and brands. The platform aims to provide authentic product information and purchase links in a Masterclass-style format, covering various sports and entertainment figures. Its vision is to become a leading destination for fashion enthusiasts seeking inspiration and direct access to celebrity-endorsed styles, with significant market potential in the personalized fashion and e-commerce sectors.

## User Preferences
- Prefers authentic data and real product information over mock/placeholder content
- Values premium styling with amber color scheme and Playfair font
- Requests specific layout formats (three-column design for Personal Favourites)
- Emphasizes authentic celebrity information and real purchase links
- Interested in Pakistani celebrity profiles and fashion representation
- Focus on luxury brand showcases with premium visual effects

## System Architecture
The platform is built with a clear separation between its frontend and backend components.

**Frontend (React + TypeScript)**
- **Framework**: React.js, leveraging TypeScript for type safety.
- **Styling**: Tailwind CSS is used for styling, with a custom theme to maintain a consistent aesthetic.
- **Animations**: Framer Motion is integrated for advanced animations, enhancing user experience.
- **Routing**: Wouter handles client-side routing, providing a seamless navigation experience.
- **State Management**: TanStack Query is utilized for managing server state efficiently.
- **UI/UX Decisions**: The design prioritizes a premium visual aesthetic with an amber color scheme and the Playfair font. Layouts, such as the three-column design for "Personal Favourites," are specifically requested to optimize content presentation.

**Backend (Express + Node.js)**
- **Framework**: Express.js forms the core of the backend, providing a robust API layer.
- **Database**: In-memory storage (MemStorage) is currently used for rapid development and prototyping.
- **Technical Implementations**: The backend supports AI integration for content analysis and advanced image recognition for style and fashion analysis.
- **System Design Choices**: Emphasis is placed on authentic product data and real brand partnerships to ensure data integrity and user trust.

**Key Features**
- Comprehensive celebrity profile pages featuring authentic brand information.
- AI-powered style analysis and personalized recommendations.
- Real-time image recognition capabilities for fashion analysis.
- Integration of authentic product links with accurate pricing information.
- Premium brand showcase and discovery platform with luxury visual effects.
- Celebrity fashion curation and trend analysis.
- Pakistani celebrity fashion representation including political figures, entrepreneurs, designers, and sports legends.
- Enhanced luxury brands section with premium styling and celebrity endorsements.

## External Dependencies
- **AI Services**: Anthropic Claude and OpenAI are integrated for AI-driven content analysis.
- **Third-Party Services**: The platform links to various brand purchase sites for products from brands like Rolex, Lamborghini, Creed, Netflix Kids, Armani, Fisher-Price, Junaid Jamshed, Ferragamo, Bose, Rebecca Yarros, PwC, Randolph Engineering, Kiehl's, Titleist, Princess Polly, Urban Outfitters, Reformation, ZARA, H&M, ASOS, and Shein.