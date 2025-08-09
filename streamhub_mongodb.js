// === DOCUMENT INSERTION ===

// Insert sample ratings for existing content
db.ratings.insertMany([
  {
    rating: 5,
    comment: "Incredible movie, Christopher Nolan's masterpiece!",
    rating_date: "2024-02-05T20:00:00Z",
    helpful_votes: 15,
    spoiler: false
  },
  {
    rating: 4,
    comment: "Great series, very addictive",
    rating_date: "2024-02-03T22:30:00Z",
    helpful_votes: 8,
    spoiler: false
  }
]);

// Insert sample playlists
db.playlists.insertMany([
  {
    name: "Action Movie Night",
    creation_date: "2024-02-01T18:00:00Z",
    description: "Best action movies for weekend",
    public: true,
    contents: [
      {
        title: "The Dark Knight",
        date_added: "2024-02-01T18:05:00Z",
        order: 1
      }
    ],
    total_contents: 1,
    followers: 5
  },
  {
    name: "Sci-Fi Collection",
    creation_date: "2024-02-02T19:00:00Z",
    description: "Mind-bending science fiction",
    public: false,
    contents: [
      {
        title: "Stranger Things",
        date_added: "2024-02-02T19:10:00Z",
        order: 1
      }
    ],
    total_contents: 1,
    followers: 2
  }
]);

// Insert sample interactions
db.interactions.insertMany([
  {
    interaction_type: "like",
    interaction_date: "2024-02-06T21:00:00Z",
    active: true
  },
  {
    interaction_type: "comment",
    interaction_date: "2024-02-07T20:30:00Z",
    specific_episode: {
      "season": 1,
      "episode_number": 1
    },
    comment: "Amazing pilot episode!",
    active: true
  }
]);

// === QUERIES WITH FIND ===

// Find high-rated movies
db.multimedia_content.find({
  "type": "movie",
  "average_rating": {"$gte": 4.8}
});

// Find users from Latin America
db.users.find({
  "country": {"$in": ["Mexico", "Argentina", "Colombia"]}
});

// Find fantasy content
db.multimedia_content.find({"genres": "Fantasy"});

// Find recent content (added in 2024)
db.multimedia_content.find({
  "date_added": {"$gte": "2024-01-01T00:00:00Z"}
});

// === UPDATES AND DELETIONS ===

// Update Maria's profile to add more viewing history
db.users.updateOne(
  {"email": "maria.garcia@email.com"},
  {"$push": {"viewing_history": {
    "title": "Stranger Things",
    "viewing_date": "2024-02-08T21:30:00Z",
    "watched_time": 180,
    "completed": false
  }}}
);

// Update The Dark Knight's rating
db.multimedia_content.updateOne(
  {"title": "The Dark Knight"},
  {"$set": {"average_rating": 4.92, "total_ratings": 46500}}
);

// Remove old interactions
db.interactions.deleteMany({
  "interaction_date": {"$lt": "2024-01-01T00:00:00Z"}
});

// === INDEX CREATION ===

// Essential indexes for performance
db.users.createIndex({"email": 1}, {"unique": true});
db.users.createIndex({"country": 1});
db.multimedia_content.createIndex({"title": 1});
db.multimedia_content.createIndex({"type": 1, "genres": 1});
db.multimedia_content.createIndex({"average_rating": -1});
db.ratings.createIndex({"rating_date": -1});
db.playlists.createIndex({"public": 1});

// === ADVANCED AGGREGATIONS ===

// Content performance analysis
db.multimedia_content.aggregate([
  {"$group": {
    "_id": "$type",
    "count": {"$sum": 1},
    "avg_rating": {"$avg": "$average_rating"},
    "total_ratings": {"$sum": "$total_ratings"}
  }},
  {"$sort": {"avg_rating": -1}}
]);

// Genre popularity analysis
db.multimedia_content.aggregate([
  {"$unwind": "$genres"},
  {"$group": {
    "_id": "$genres",
    "content_count": {"$sum": 1},
    "avg_rating": {"$avg": "$average_rating"}
  }},
  {"$sort": {"content_count": -1}},
  {"$limit": 5}
]);

// User engagement by country
db.users.aggregate([
  {"$addFields": {
    "viewing_count": {"$size": {"$ifNull": ["$viewing_history", []]}},
    "total_watch_time": {"$sum": "$viewing_history.watched_time"}
  }},
  {"$group": {
    "_id": "$country",
    "user_count": {"$sum": 1},
    "avg_viewing_count": {"$avg": "$viewing_count"},
    "total_watch_time": {"$sum": "$total_watch_time"}
  }},
  {"$sort": {"total_watch_time": -1}}
]);

// Most active users analysis
db.users.aggregate([
  {"$addFields": {
    "total_content_watched": {"$size": {"$ifNull": ["$viewing_history", []]}},
    "total_minutes_watched": {"$sum": "$viewing_history.watched_time"}
  }},
  {"$match": {"total_content_watched": {"$gt": 0}}},
  {"$sort": {"total_minutes_watched": -1}},
  {"$project": {
    "name": 1,
    "country": 1,
    "total_content_watched": 1,
    "total_minutes_watched": 1,
    "avg_minutes_per_content": {
      "$divide": ["$total_minutes_watched", "$total_content_watched"]
    }
  }}
]);