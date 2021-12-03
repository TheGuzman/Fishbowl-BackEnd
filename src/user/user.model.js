import { MongoClient } from 'mongodb'
import URI from './URI.js'

const client = new MongoClient(URI)

// export async function getUserInfoByEmailAndPassword(email, password){
//     try{
//         await client.connect()
//         const database = client.db('Fishbowl')
//         const users = database.collection('Users')
//         const exists = await users.find({userEmail:email, userPassword:password})
//         console.log(exists)
//         return exists
//     }
//     catch(err){
//         console.log(err)
//     }
//     finally{
//         await client.close()
//     }
// }


export async function registerUser(name, email, password){

    let user = {userName: name, userEmail:email, userPassword:password, isValid:false, userFishbowls:[]}
    try{
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const newUser = await users.insertOne(user)
        return newUser
    }
    catch(err){
        console.log(err)
    }
    finally{
      await client.close()
    }

}