// import * as React from 'react';
// import * as Styles from '../styles/styles';
// import firestore, { firebase } from '@react-native-firebase/firestore';
// import * as Schemas from './Schemas';
import firebase from 'react-native-firebase'
import moment from 'moment';
import * as Constants from '../constants/Constants';
import { store } from '../../App';
import { addEvent, updateEvent, removeEvents, addUsers, removeUsers, setUsers, updateUser, setFirstName, setLastName, setAvatar, setMyId, setEvents } from '../actions/Actions';
import { isMe } from '../utils/Utils';

const MESSAGES_PER_COLLECTION = 100;

class FirebaseService {
    eventsRef: any;
    usersRef: any;
    userEventsRef: any;
    userFriendsRef: any;
    messagesRef: any;

    constructor() {
        this.eventsRef = firebase.firestore().collection('events');
        this.usersRef = firebase.firestore().collection('users');
        this.userEventsRef = firebase.firestore().collection('userEvents');
        this.userFriendsRef = firebase.firestore().collection('userFriends');
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
        store.dispatch(setMyId(''));
        store.dispatch(setFirstName(''));
        store.dispatch(setLastName(''));
        store.dispatch(setAvatar(''));
        store.dispatch(setUsers({}));
        store.dispatch(setEvents({}));
    }

    async createAccount(email, password) {
        console.log('create account with', email, password);
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        return email;
    }

    async getEvent(eventId, field=undefined) {
        const docSnapshot = await this.eventsRef.doc(eventId).get();
        let event = docSnapshot.data();
        // convert from Firestore Timestamp to JS Date
        if (event.hasOwnProperty('startDate')) {
            event['startDate'] = event['startDate'].toDate();
        }
        if (event.hasOwnProperty('endDate')) {
            event['endDate'] = event['endDate'].toDate();
        }
        store.dispatch(addEvent({[eventId]: event}));
        if (field === undefined) {
            return event;
        } else {
            return event[field];
        }
    }

    async addEvent(event) {
        console.log('add event database');
        const doc = this.eventsRef.doc();
        await doc.set(event);
        const eventId = doc.id;
        console.log('add event database', eventId);

        store.dispatch(addEvent({[eventId]: event}));
        console.log(eventId, await this.messagesRef.doc(eventId).set({test: true}));
        await this.messagesRef.doc(eventId).set({numMessages: 0});
        console.log('add event database DONE');
        return eventId;
    }

    async updateEvent(eventId, event) {
        await this.eventsRef.doc(eventId).set(event, { merge: true });
        store.dispatch(updateEvent({[eventId]: event}));
    }

    async removeEvent(eventId) {
        const doc = this.eventsRef.doc(eventId);
        const invited = (await doc.get()).get('invited');

        for (const userId of invited) {
            await this.userEventsRef.doc(userId).update({
                events: firebase.firestore.FieldValue.arrayRemove(eventId)
            });
        }

        await this.messagesRef.doc(eventId).delete();

        // await this.removeFriendInvites(eventId, invited);
        await doc.delete();
        store.dispatch(removeEvents([eventId]));
        return doc.id;
    }

    async getUser(userId, field=undefined) {
        const docSnapshot = await this.usersRef.doc(userId).get();
        
        const user = docSnapshot.data();
        if (user) {
            if (isMe(userId)) {
                const { firstName, lastName, avatar } = user;
                if (firstName) {
                    store.dispatch(setFirstName(firstName));
                }
                if (lastName) {
                    store.dispatch(setLastName(lastName));
                }
                if (avatar) {
                    store.dispatch(setAvatar(avatar));
                }
            } else {
                store.dispatch(addUsers({ [userId]: user }));
            }
        }

        if (field === undefined) {
            return user;
        } else {
            return user[field];
        }
    }

    async addUser(userId, user, friends) {
        const userDoc = this.usersRef.doc(userId);
        await userDoc.set(user);
        const userEventDoc = this.userEventsRef.doc(userId);
        await userEventDoc.set({events: []});
        const userFriendDoc = this.userFriendsRef.doc(userId);
        await userFriendDoc.set({friends: friends});


        if (isMe(userId)) {
            const { firstName, lastName, avatar } = user;
            if (firstName) {
                store.dispatch(setFirstName(firstName));
            }
            if (lastName) {
                store.dispatch(setLastName(lastName));
            }
            if (avatar) {
                store.dispatch(setAvatar(avatar));
            }
        }
        // return doc.id;
    }

    async getFriends(userId) {
        const friendIds = (await this.userFriendsRef.doc(userId).get()).get('friends');
        let friends = {};
        for (const id of friendIds) {
            friends[id] = await this.getUser(id);
            friends[id].isFriend = true;
            if (isMe(userId)) {
                store.dispatch(updateUser({ [id]: friends[id] }));
            }
        }
        console.log('friends', friends);
        return friends;
    }

    async getEvents(userId) {
        const eventIds = (await this.userEventsRef.doc(userId).get()).get('events');
        let events = {};
        for (const id of eventIds) {
            const event = await database.getEvent(id);
            if ((event.endDate ? event.endDate : moment(event.startDate).add(1, 'hour').toDate()) >= new Date()) {
                events[id] = event;
            }
            for (const invitedId of event.invited) {
                if (!(invitedId in store.getState()['users'])) {
                    database.getUser(invitedId);
                }
            }
        }
        return events;
    }

    async updateFriendInvites(eventId: string, invited: string[]) {
        store.dispatch(updateEvent({[eventId]: {invited: invited}}));

        const originalInvited = (await this.eventsRef.doc(eventId).get()).get('invited');
        let before = new Set(originalInvited);
        let after = new Set(invited);
        console.log(originalInvited, invited);
        console.log(before, after);

        // remove those who were originally invited and now not invited
        const toRemove = Array.from(new Set([...before].filter(x => !after.has(x))));
        console.log('toremove', toRemove);
        for (const id of toRemove) {
            await this.userEventsRef.doc(id).update({
                events: firebase.firestore.FieldValue.arrayRemove(eventId)
            });
        }

        // add those who weren't originally invited and now are invited
        const toAdd = Array.from(new Set([...after].filter(x => !before.has(x))));
        console.log('toAdd', toAdd);
        for (const id of toAdd) {
            await this.userEventsRef.doc(id).update({
                events: firebase.firestore.FieldValue.arrayUnion(eventId)
            });
        }

        await this.eventsRef.doc(eventId).set({
            invited: invited
        }, { merge: true });
    }

    // async addFriendInvite(eventId, userId) {
    //     console.log('add friend invite', eventId, userId);
    //     await this.userEventsRef.doc(userId).update({
    //         events: firebase.firestore.FieldValue.arrayUnion(eventId)
    //     });
    //     await this.eventsRef.doc(eventId).update({
    //         invited: firebase.firestore.FieldValue.arrayUnion(userId)
    //     });

    //     let invited = store.getState()['events'][eventId].invited;
    //     if (invited.indexOf(userId) === -1) {
    //         invited.push(userId);
    //     }
    //     store.dispatch(updateEvent({[eventId]: {invited: invited}}));
    // }

    // async removeFriendInvites(eventId, userIds: string[]) {
    //     console.log('remove friend invites', eventId, userIds);
    //     if (!userIds || !eventId) {
    //         return;
    //     }
    //     // remove eventId from each of the users
    //     for (const userId of userIds) {
    //         await this.userEventsRef.doc(userId).update({
    //             events: firebase.firestore.FieldValue.arrayRemove(eventId)
    //         });
    //     }
        
    //     // remove userIds from event's invited list
    //     let newInvited = [];
    //     const originalInvited = await this.getEvent(eventId, 'invited');
    //     for (const invitedId of originalInvited) {
    //         if (userIds.indexOf(invitedId) === -1) {
    //             newInvited.push(invitedId);
    //         }
    //     }
    //     await this.eventsRef.doc(eventId).set({
    //         invited: newInvited
    //     }, { merge: true });
        
    //     store.dispatch(updateEvent({[eventId]: {invited: newInvited}}));
    // }

    async updateUser(userId, user) {
        await this.usersRef.doc(userId).update(user);
        
        if (isMe(userId)) {
            const { firstName, lastName, avatar } = user;
            if (firstName) {
                store.dispatch(setFirstName(firstName));
            }
            if (lastName) {
                store.dispatch(setLastName(lastName));
            }
            if (avatar) {
                store.dispatch(setAvatar(avatar));
            }
        }
    }

    async addFriend(userId, friendId, friend) {
        if (isMe(userId)) {
            friend.isFriend = true;
            store.dispatch(updateUser({ [friendId]: friend }));
        }
        await this.userFriendsRef.doc(userId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(friendId)
        });
        await this.userFriendsRef.doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(userId)
        });
    }

    async removeFriend(userId, friendId, friend) {
        if (isMe(userId)) {
            delete friend.isFriend;
            store.dispatch(updateUser({ [friendId]: friend }));
        }
        console.log('remove from', friendId, userId);
        await this.userFriendsRef.doc(friendId).update({
            friends: firebase.firestore.FieldValue.arrayRemove(userId)
        });
        console.log('remove from', userId, friendId);
        await this.userFriendsRef.doc(userId).update({
            friends: firebase.firestore.FieldValue.arrayRemove(friendId)
        });
    }

    async uploadProfilePicture(source, userId) {
        console.log('upload profile pic', userId);
        const ext = source.split('.').pop(); // Extract image extension
        const timestamp = (new Date()).getTime().toString();
        const filename = `${userId}_${timestamp}.${ext}`; // Generate unique name
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

    async sendPasswordResetEmail(email: string) {
        await firebase.auth().sendPasswordResetEmail(email);
    }

    async addMessagesListener(eventId: string, listener: (numMessages: number)=> {}) {
        const unsubscriber = this.messagesRef.doc(eventId).onSnapshot(
            async function(snapshot) {
                // const response = snapshot.docChanges();
                listener(await snapshot.get('numMessages'));
                // response.forEach(function(change) {
                //         if (change.type === "added") {
                //             var bodyPaint="New favorites: ";
                //         }
                //         if (change.type === "modified") {
                //             var bodyPaint="Modified favorites: "; 
                //         }
                //         if (change.type === "removed") {
                //             var bodyPaint="Removed favorites: ";
                //         }
        
                //     navigator.serviceWorker.ready.then(function(registration) {
                //         const title = 'LA BUENOS AIRES';
                //         const options = {
                //           body: bodyPaint,
                //           icon: 'images/icon.png',
                //           badge: 'images/badge.png'
                //         };
                //         registration.showNotification(title, options);
                //       });
                // });
            }
        );
        return unsubscriber;
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
    async getMessages(eventId: string, lastN: number = Constants.START_NUM_MESSAGES, endOffset: number = 0) {
        const nullReturn = {messages: [], numMessages: 0};
        if (lastN === 0) {
            return nullReturn;
        }
        const groupChat = this.messagesRef.doc(eventId);
        const numMessages = (await groupChat.get()).get('numMessages');
        if (numMessages === 0) {
            return nullReturn;
        }
        const endNumMessages = Math.max(numMessages - endOffset, 0);
        lastN = Math.min(endNumMessages, lastN);
        if (lastN === 0) {
            return nullReturn;
        }
        const numCollections = Math.ceil(endNumMessages / MESSAGES_PER_COLLECTION);

        const getCollectionMessages = async (collectionNumber: number) => {
            let collectionMessages = (await groupChat.collection("messages").doc(collectionNumber.toString()).get()).get('messages');
            collectionMessages.forEach((message, index) => {
                collectionMessages[index].createdAt = collectionMessages[index].createdAt.toDate();
            });
            return collectionMessages;
        }
        const messagesInLastCollection = await getCollectionMessages(numCollections - 1);
        const numMessagesInLastCollection = endNumMessages % MESSAGES_PER_COLLECTION;
        

        let messages = [];
        if (numMessagesInLastCollection >= lastN) {
            // return last lastN messages in last collection
            messages = messagesInLastCollection.slice(numMessagesInLastCollection-lastN, numMessagesInLastCollection);
        } else {
            // not enough messages
            lastN -= numMessagesInLastCollection;
            const startCollection = numCollections - 1 - Math.ceil(lastN / MESSAGES_PER_COLLECTION);
            for (let i = startCollection; i < numCollections - 1; i += 1) {
                let collectionMessages = await getCollectionMessages(i);
                if (i === startCollection && lastN % MESSAGES_PER_COLLECTION !== 0) {
                    collectionMessages = collectionMessages.slice(collectionMessages.length - (lastN % MESSAGES_PER_COLLECTION), collectionMessages.length);
                }
                messages.push(...collectionMessages);
            }
            messages.push(...messagesInLastCollection);
        }
        return {messages, numMessages};
    }
}

const database = new FirebaseService();
export default database;
