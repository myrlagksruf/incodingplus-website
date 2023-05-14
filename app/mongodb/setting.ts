import { Document, Filter, MongoClient } from "mongodb";
import { MyFile, MyFileBuffer } from "../type";

const url = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@incodingplus-website.l6hgtd1.mongodb.net/test`;
const client = new MongoClient(url);
const dbName = 'INCODINGPLUS_DB';
const dcName = 'INCODINGPLUS_DOCUMENTS';
export async function handler(){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<MyFile | MyFileBuffer>(dcName);
    return {
        client, collection
    };
}