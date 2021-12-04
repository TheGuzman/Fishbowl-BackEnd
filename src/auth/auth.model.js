import { MongoClient } from 'mongodb'
import URI from '../user/URI.js'

const client = new MongoClient(URI)



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

export async function retrieveEmailByToken (token) {

    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Registrations')
        const email = await users.findOne({token})
        return email
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

export async function validateToken (token) {

    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const registeredEmails = database.collection('Registrations')
        const user = await registeredEmails.findOne({userToken:token})
        return user.userEmail
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}
