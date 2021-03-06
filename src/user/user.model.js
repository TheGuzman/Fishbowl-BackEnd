import { MongoClient } from 'mongodb'
import URI from './URI.js'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const client = new MongoClient(URI)

export async function getUserInfoByEmailAndPassword(email, password) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const exists = await users.findOne({ email: email, password: password })
        return exists
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function getUserInfoByEmailAndUserName(userEmail, userName) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const exists = await users.findOne({ $or: [{ email: userEmail }, { name: userName }] })
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
        const exists = await users.findOne({ email: email })
        return exists
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

// export async function getUserInfoById(userId) {
//     try {
//         await client.connect()
//         const database = client.db('Fishbowl')
//         const users = database.collection('Users')
//         const user = await users.find({ userEmail: userId })
//         return user
//     }
//     catch (err) {
//         console.log(err)
//     }
//     finally {
//         await client.close()
//     }
// }

export async function registerUser(name, email, password) {

    let user = { name: name, email: email, password: password, isValid: false, fishbowls: [] }
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
            await users.updateOne({ email: email }, { $set: { isValid: true } }, { upsert: true })
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

    let fishbowl = { name: name, theme: theme, description: description, time: date, creator: creator, state: 'created', roomId: uuidv4() }
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const newFishbowl = await fishbowls.insertOne(fishbowl)

        const users = database.collection('Users')   //Encuentra el usuario que ha creado el fishbowl y lo pushea a su array de fishbowls personales
        const addNewFishbowltoUser = await users.updateOne({ name: creator }, { $push: { fishbowls: newFishbowl.insertedId } }, { upsert: true })
        return newFishbowl, addNewFishbowltoUser
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}


export async function retrieveUserFishbowls(email) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const arrFishbowl = await users.findOne({ email: email })
        return arrFishbowl.fishbowls
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

export async function retrieveUserFishbowlsById(arrId) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const arrFishbowl = await fishbowls.find({ _id: { $in: arrId.map(e => ObjectId(e)) } }).toArray()
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
        const deleteFishbowlFromUser = await users.updateOne({ name: fishbowlInfo.creator }, { $pull: { fishbowls: ObjectId(fishbowlId) } })
        return deletedFishbowl, deleteFishbowlFromUser
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

export async function startFishbowlById(fishbowlId) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const fishbowlToStart = await fishbowls.updateOne({ _id: ObjectId(fishbowlId) }, {$set:{state:'active'}})
        return fishbowlToStart
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}

export async function retrieveFishbowlByRoomId(fishbowlId) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const fishbowl = await fishbowls.findOne({ roomId:fishbowlId })
        return fishbowl
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }

}


export async function deleteUserAccountByEmail(email) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const deleteUserAccount = await users.findOneAndDelete({ email: email })
        return deleteUserAccount

    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function updateUserNameByEmail(email, newUserName) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const newUserExists = await users.findOne({ name: newUserName })
        if (newUserExists === null) {
            const updateUserName = await users.updateOne({ email: email }, { $set: { name: newUserName } }, { upsert: true })
            return updateUserName
        }
        else {
            return false
        }


    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}
export async function updateUserFishbowlCreator(oldUsername, NewUsername) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const fishbowls = database.collection('Fishbowls')
        const updateFishbowlCreatorName = await fishbowls.updateMany({ creator: oldUsername }, { $set: { creator: NewUsername } })
        return updateFishbowlCreatorName
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

export async function updateUserPasswordsByEmail(email, newPassword) {
    try {
        await client.connect()
        const database = client.db('Fishbowl')
        const users = database.collection('Users')
        const userToUpdatePasswords = await users.updateOne({email:email},{$set:{password:newPassword}},{ upsert: true })
        return userToUpdatePasswords

    }
    catch (err) {
        console.log(err)
    }
    finally {
        await client.close()
    }
}

