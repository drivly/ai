import { MongoClient, MongoClientOptions } from 'mongodb'

if (!process.env.DATABASE_URI) {
  throw new Error('Please add your MongoDB URI to .env as DATABASE_URI')
}

const uri = process.env.DATABASE_URI
const options = {} satisfies MongoClientOptions

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
