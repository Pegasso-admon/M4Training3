# StreamHub MongoDB Database

**Author:** Samuel Rosero Alvarez

A MongoDB database implementation for a multimedia streaming platform that I designed to handle user management, content cataloging, ratings, playlists, and user interactions.

## 📋 Project Overview

I developed StreamHub as a comprehensive streaming platform database that manages multimedia content, user profiles, ratings, playlists, and user interactions. This database is designed to support typical streaming service functionalities similar to Netflix, Amazon Prime, and other major platforms.

## 🗃️ Database Structure

### Collections I Implemented

- **`users`** - User profiles and account data
- **`multimedia_content`** - Movies and TV series catalog
- **`ratings`** - User ratings and reviews
- **`playlists`** - Custom user playlists
- **`interactions`** - User interactions (likes, comments, etc.)

## 🚀 Setup and Installation

### Prerequisites

- MongoDB 4.4 or higher
- MongoDB Compass (optional, for GUI management)
- Node.js (if planning to build applications on top)

### Local Setup

1. **Start MongoDB locally:**
   ```bash
   mongod --dbpath /your/db/path
   ```

2. **Connect using the connection string I configured:**
   ```
   mongodb://localhost:27017/
   ```

3. **Import my database script:**
   ```bash
   mongo < streamhub_mongodb.js
   ```

## 📊 Key Features I Built

### Data Operations
- **Content Management:** I implemented CRUD operations for movies and TV shows
- **User Management:** Complete user profile system with viewing history
- **Rating System:** Users can rate content and leave reviews
- **Playlist Creation:** Users can create and manage custom playlists
- **Interaction Tracking:** Like/dislike system with commenting functionality

### Performance Optimizations
I created several indexes to optimize query performance:
- Unique email index for users
- Compound indexes for content filtering by type and genre
- Rating-based sorting indexes
- Date-based indexes for temporal queries

## 🔍 Sample Queries I Developed

### Content Discovery
```javascript
// Find high-rated movies
db.multimedia_content.find({
  "type": "movie",
  "average_rating": {"$gte": 4.8}
});

// Find fantasy content
db.multimedia_content.find({"genres": "Fantasy"});
```

### Analytics Queries
```javascript
// Content performance by type
db.multimedia_content.aggregate([
  {"$group": {
    "_id": "$type",
    "count": {"$sum": 1},
    "avg_rating": {"$avg": "$average_rating"}
  }}
]);

// Genre popularity analysis
db.multimedia_content.aggregate([
  {"$unwind": "$genres"},
  {"$group": {
    "_id": "$genres",
    "content_count": {"$sum": 1},
    "avg_rating": {"$avg": "$average_rating"}
  }},
  {"$sort": {"content_count": -1}}
]);
```

## 🌍 User Analytics

I implemented comprehensive user analytics including:
- User engagement by country
- Viewing patterns and watch time analysis
- Most active users identification
- Content consumption trends

## 📁 Files in This Repository

- **`compass-connections.json`** - MongoDB Compass connection configuration
- **`streamhub_mongodb.js`** - Complete database setup script with sample data

## 🛠️ Technical Implementation

### Database Design Decisions I Made
- **Embedded vs Referenced Data:** I used embedded documents for viewing history to optimize read performance
- **Flexible Schema:** Designed to accommodate different content types (movies vs series)
- **Scalable Indexing:** Strategic indexes for common query patterns
- **Data Validation:** Implemented through application logic and MongoDB validators

### Sample Data I Included
- User profiles from different countries
- Popular movies and TV series
- Realistic ratings and comments
- Sample playlists and user interactions

## 🔧 Usage Examples

### Adding New Content
```javascript
db.multimedia_content.insertOne({
  title: "New Movie",
  type: "movie",
  genres: ["Action", "Thriller"],
  release_date: "2024-03-15T00:00:00Z",
  average_rating: 0,
  total_ratings: 0
});
```

### User Activity Tracking
```javascript
db.users.updateOne(
  {"email": "user@email.com"},
  {"$push": {"viewing_history": {
    "title": "Movie Title",
    "viewing_date": new Date(),
    "watched_time": 120,
    "completed": true
  }}}
);
```

## 📈 Performance Considerations

I optimized the database for:
- **Fast content searches** by genre, type, and rating
- **Efficient user lookups** using email indexing
- **Quick playlist access** with proper indexing
- **Scalable aggregation queries** for analytics

## 🤝 Contributing

Feel free to fork this project and submit improvements. I'm particularly interested in:
- Additional aggregation pipelines for analytics
- Performance optimizations
- New feature implementations
- Data validation enhancements

## 📞 Contact

**Samuel Rosero Alvarez**
- Feel free to reach out for questions about the implementation
- Open to collaboration and improvements

---

*This database schema represents a scalable foundation for streaming platforms and can be extended based on specific business requirements.*