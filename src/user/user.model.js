import { MongoClient } from 'mongodb'
import URI from './URI.js'
import { ObjectId } from 'mongodb'

const client = new MongoClient(URI)

export async function getUserInfoByEmailAndPassword(email, password) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const exists = await users.findOne({ userEmail: email, userPassword: password })
        console.log(exists)
        return exists
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

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

export async function getUserInfoById(userId) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const user = await users.find({ userEmail: userId })
        console.log(user)
        return user
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function registerUser(name, email, password) {

    let user = { userName: name, userEmail: email, userPassword: password, isValid: false, userFishbowls: [] }
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const newUser = await users.insertOne(user)
        return newUser
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

export async function updateUserMailVerification(email) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const newUser = await users.find({ userEmail: email })
        if (newUser !== null) {
            await users.updateOne({ userEmail: email }, { $set: { isValid: true } }, { upsert: true })
        }
        else {
            console.log('email does not match')
        }
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function registerFishbowl(name, theme, description, date, creator) {

    let fishbowl = { fishbowlName: name, fishbowlTheme: theme, fishbowlDescription: description, fishbowlTime: date, fishbowlCreator: creator }
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const newFishbowl = await fishbowls.insertOne(fishbowl)
        console.log(newFishbowl)

        const users = database.collection('Users')   //Encuentra el usuario que ha creado el fishbowl y lo pushea a su array de fishbowls personales
        const addNewFishbowltoUser = await users.updateOne({ userName: creator }, { $push: { userFishbowls: fishbowl } }, { upsert: true })
        console.log(addNewFishbowltoUser)
        return newFishbowl, addNewFishbowltoUser
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}


export async function retrieveUserFishbowls(userEmail) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const arrFishbowl = await users.findOne({ userEmail: userEmail })
        console.log('fromretrieve userFishbowls')
        return arrFishbowl
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}


export async function retrieveAllFishbowls() {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const allFishbowls = await fishbowls.find().toArray()
        return allFishbowls
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}


export async function deleteFishbowlById(fishbowlId) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const fishbowlInfo = await fishbowls.findOne({ _id: ObjectId(fishbowlId) }); //Necesito obtener primero la info del fishbowl que voy a borrar para pasarsela como query para borrar del array del User
        const deletedFishbowl = await fishbowls.findOneAndDelete({ _id: ObjectId(fishbowlId) })

        const users = database.collection('Users')   //Encuentra el usuario que ha creado el fishbowl y lo borra de su array de fishbowls personales
        const deleteFishbowlFromUser = await users.updateOne({ userName: fishbowlInfo.fishbowlCreator }, { $pull: { userFishbowls: { _id: ObjectId(fishbowlId) } } })

        console.log(deleteFishbowlFromUser)
        return deletedFishbowl, deleteFishbowlFromUser
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

