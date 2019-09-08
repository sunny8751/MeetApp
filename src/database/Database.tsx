// import * as React from 'react';
// import * as Styles from '../styles/styles';
// import firestore, { firebase } from '@react-native-firebase/firestore';
// import * as Schemas from './Schemas';
import firebase from 'react-native-firebase'
import moment from 'moment';

// export const myId = '9TqXXYoMasO9PnYsQwcM';
// export const getUserInfo = async (uuid: string) => {
//     const documentSnapshot = await firebase.firestore().collection('users').doc(uuid).get();
//     return documentSnapshot.data();
// }

const MESSAGES_PER_COLLECTION = 100;

class FirebaseService {
    eventsRef: any;
    usersRef: any;
    messagesRef: any;

    constructor() {
        this.eventsRef = firebase.firestore().collection('events');
        this.usersRef = firebase.firestore().collection('users');
        this.messagesRef = firebase.firestore().collection('messages');
    }

    async loginWithEmail(email, password) {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        return email;
    }

    async loginWithPhone(phoneNumber) {
        await firebase.auth().signInWithPhoneNumber(phoneNumber);
        return phoneNumber;
    }

    async logout() {
        await firebase.auth().signOut();
    }

    async createAccount(email, password) {
        console.log('create account with', email, password);
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        return email;
    }

    async getEvent(eventId, field=undefined) {
        const docSnapshot = await this.eventsRef.doc(eventId).get();
        if (field === undefined) {
            let event = docSnapshot.data();
            // convert from Firestore Timestamp to JS Date
            if (event.hasOwnProperty('startDate')) {
                event['startDate'] = event['startDate'].toDate();
            }
            if (event.hasOwnProperty('endDate')) {
                event['endDate'] = event['endDate'].toDate();
            }
            return event;
        } else {
            let event = docSnapshot.get(field);
            if (field === 'startDate' || field === 'endDate') {
                event = event.toDate();
            }
            return event;
        }
    }

    async addEvent(event) {
        const doc = this.eventsRef.doc();
        console.log('add event', doc.id, event);
        await doc.set(event);
        return doc.id;
    }

    async updateEvent(eventId, event) {
        await this.eventsRef.doc(eventId).set(event, { merge: true });
    }

    async removeEvent(eventId) {
        const doc = this.eventsRef.doc(eventId);
        const invited = (await doc.get()).get('invited');
        console.log(doc, invited, doc.id);

        for (const userId of invited) {
            await this.usersRef.doc(userId).update({
                events: firebase.firestore.FieldValue.arrayRemove(eventId)
            });
        }

        // await this.removeFriendInvites(eventId, invited);
        await doc.delete();
        return doc.id;
    }

    async getUser(userId, field=undefined) {
        const docSnapshot = await this.usersRef.doc(userId).get();
        if (field === undefined) {
            return docSnapshot.data()
        } else {
            return docSnapshot.get(field);
        }
    }

    async addUser(userId, user) {
        const doc = this.usersRef.doc(userId);
        await doc.set(user);
        // return doc.id;
    }

    async getFriends(userId) {
        const friendIds = await this.getUser(userId, 'friends');
        let friends = {};
        for (const id of friendIds) {
            friends[id] = await this.getUser(id);
        }
        return friends;
    }

    async getEvents(userId) {
        const eventIds = await database.getUser(userId, 'events');
        let events = {};
        for (const id of eventIds) {
            const event = await database.getEvent(id);
            if ((event.endDate ? event.endDate : moment(event.startDate).add(1, 'hour').toDate()) >= new Date()) {
                events[id] = event;
            }
        }
        return events;
    }

    async addFriendInvite(eventId, userId) {
        console.log('add friend invite', eventId, userId);
        await this.usersRef.doc(userId).update({
            events: firebase.firestore.FieldValue.arrayUnion(eventId)
        });
    }

    async removeFriendInvites(eventId, userIds: string[]) {
        console.log('remove friend invites', eventId, userIds);
        if (!userIds || !eventId) {
            return;
        }
        for (const userId of userIds) {
            await this.usersRef.doc(userId).update({
                events: firebase.firestore.FieldValue.arrayRemove(eventId)
            });
        }
        
        let newInvited = [];
        const originalInvited = await this.getEvent(eventId, 'invited');
        for (const invitedId of originalInvited) {
            if (userIds.indexOf(invitedId) === -1) {
                newInvited.push(invitedId);
            }
        }
        await this.eventsRef.doc(eventId).set({
            invited: newInvited
        }, { merge: true });
    }

    async updateUser(userId, user) {
        await this.usersRef.doc(userId).update(user);
    }

    async addFriend(userId, friendId) {
        await this.usersRef.doc(userId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(friendId)
        });
        await this.usersRef.doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(userId)
        });
    }

    async removeFriend(userId, friendId) {
        await this.usersRef.doc(userId).update({
            friends: firebase.firestore.FieldValue.arrayRemove(friendId)
        });
        await this.usersRef.doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayRemove(userId)
        });
    }

    async uploadProfilePicture(source, userId) {
        const ext = source.split('.').pop(); // Extract image extension
        const filename = `${userId}.${ext}`; // Generate unique name
        // this.setState({ uploading: true });
        const uploadResult = await firebase.storage().ref(`avatars/${filename}`).putFile(source);
        // .on(
            //     firebase.storage.TaskEvent.STATE_CHANGED,
            //     snapshot => {
            //         let state = {
            //             progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
            //         };
            //         if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
            //             const allImages = this.state.images;
            //             allImages.push(snapshot.downloadURL);
            //             state = {
            //                 ...state,
            //                 uploading: false,
            //                 imgSource: '',
            //                 imageUri: '',
            //                 progress: 0,
            //                 images: allImages
            //             };
            //             AsyncStorage.setItem('images', JSON.stringify(allImages));
            //         }
            //         this.setState(state);
            //     },
            //     error => {
            //         unsubscribe();
            //         alert('Sorry, Try again.');
            //     }
            // );
        return uploadResult.downloadURL;
        // await this.usersRef.doc(userId).update({
        //     avatar: uploadResult.downloadURL
        // });
    }

    async updatePassword(newPassword) {
        await firebase.auth().currentUser.updatePassword(newPassword);
    }

    async addMessage(eventId: string, message: any) {
        const groupChat = this.messagesRef.doc(eventId);
        const numMessages = (await groupChat.get()).get('numMessages');
        const numCollections = Math.ceil(numMessages / MESSAGES_PER_COLLECTION);

        if (numMessages % MESSAGES_PER_COLLECTION === 0) {
            // create new doc
            await groupChat.collection("messages").doc(numCollections.toString()).set({
                messages: [message]
            });
        } else {
            await groupChat.collection("messages").doc((numCollections - 1).toString()).update({
                messages: firebase.firestore.FieldValue.arrayUnion(message)
            });
        }

        await groupChat.set({numMessages: numMessages + 1}, {merge: true})
    }

    // least recent to most recent
    async getMessages(eventId: string, lastN: number = 20) {
        const groupChat = this.messagesRef.doc(eventId);
        const numMessages = (await groupChat.get()).get('numMessages');
        if (numMessages === 0) {
            return [];
        }
        lastN = Math.min(numMessages, lastN);
        const numCollections = Math.ceil(numMessages / MESSAGES_PER_COLLECTION);

        const getCollectionMessages = async (collectionNumber: number) => {
            let collectionMessages = (await groupChat.collection("messages").doc(collectionNumber.toString()).get()).get('messages');
            collectionMessages.forEach((message, index) => {
                collectionMessages[index].createdAt = collectionMessages[index].createdAt.toDate();
            });
            return collectionMessages;
        }
        const messagesInLastCollection = await getCollectionMessages(numCollections - 1);
        if (messagesInLastCollection.length >= lastN) {
            // return last lastN messages in last collection
            return messagesInLastCollection.slice(messagesInLastCollection.length-lastN, messagesInLastCollection.length);
        } else {
            // not enough messages
            let messages = [];
            lastN -= messagesInLastCollection.length;
            const startCollection = numCollections - 1 - Math.ceil(lastN / MESSAGES_PER_COLLECTION);
            for (let i = startCollection; i < numCollections - 1; i += 1) {
                let collectionMessages = await getCollectionMessages(i);
                if (i === startCollection && lastN % MESSAGES_PER_COLLECTION !== 0) {
                    collectionMessages = collectionMessages.slice(collectionMessages.length - (lastN % MESSAGES_PER_COLLECTION), collectionMessages.length);
                }
                messages.push(...collectionMessages);
            }
            messages.push(...messagesInLastCollection);
            return messages;
        }
    }
}

const database = new FirebaseService();
export default database;
