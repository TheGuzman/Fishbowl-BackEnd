import { MongoClient } from 'mongodb'
import URI from './URI.js'

const URIlink = URI

const client = new MongoClient(URIlink)

export async function getUserEmail(email){
    try{
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const exists = await users.findOne({userEmail:email})
        console.log(exists)
        // return exists
    }
    catch(err){
        console.log(err)
    }
    finally{
        await client.close()
    }
}


export async function registerUser(user){

    try{
        await client.connect()
        const database = client.db('Social-Network')
        const users = database.collection('users')
        const newUser = await users.insertOne(user)
        return newUser.insertedId
    }
    catch(err){
        console.log(err)
    }
    finally{
      await client.close()
    }

}