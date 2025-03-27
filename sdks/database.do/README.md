# [database.do](https://database.do)

```typescript
import { DB } from 'database.do'

const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors'
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags'  // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author'  // Join field to posts (reverse relation)
  }
})
```

## Implementation

Behind the scenes this is using [Payload](https://payloadcms.com) to create a database schema, and under that Mongoose is used for MongoDB and Drizzle ORM is used for PostgreSQL and SQLite.  This also provides an automatic Admin UI as well as a REST API with full List + CRUD (Create, Read, Update, Delete) operations.