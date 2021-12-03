import { MongoClient } from 'mongodb'
import URI from '../user/URI.js'

const client = new MongoClient(URI)


export async function getUserInfoByEmail(email) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const exists = await users.findOne({ userEmail: email })
        return exists
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function registerToken(token, email) {

    let newRegisteredUser = { userToken: token, userEmail: email }
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Registrations')
        const newRegistration = await users.insertOne(newRegisteredUser)
        return newRegistration
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}
