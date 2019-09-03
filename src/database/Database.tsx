// import * as React from 'react';
// import * as Styles from '../styles/styles';
// import firestore, { firebase } from '@react-native-firebase/firestore';
// import * as Schemas from './Schemas';
import firebase from 'react-native-firebase'

export const myId = '9TqXXYoMasO9PnYsQwcM';
// export const getUserInfo = async (uuid: string) => {
//     const documentSnapshot = await firebase.firestore().collection('users').doc(uuid).get();
//     return documentSnapshot.data();
// }

class FirebaseService {
    constructor() {
        this.eventsRef = firebase.firestore().collection('events');
        this.usersRef = firebase.firestore().collection('users');
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
        const doc = await this.eventsRef.doc();
        doc.set(event);
        return doc.id;
    }

    async removeEvent(eventId) {
        const doc = this.eventsRef.doc(eventId);
        const invited = (await doc.get()).get('invited');
        for (const userId of invited) {
            await this.removeFriend(eventId, userId);
        }
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

    async addUser(user) {
        const doc = await this.usersRef.doc();
        doc.set(user);
        return doc.id;
    }

    async getFriends(userId) {
        const friendIds = await this.getUser(userId, 'friends');
        let friendsMap = {};
        for (const id of friendIds) {
            friendsMap[id] = await this.getUser(id);
        }
        return friendsMap;
    }

    async inviteFriend(eventId, userId) {
        await this.usersRef.doc(userId).update({
            events: firebase.firestore.FieldValue.arrayUnion(eventId)
        });
    }

    async removeFriend(eventId, userId) {
        await this.usersRef.doc(userId).update({
            events: firebase.firestore.FieldValue.arrayRemove(eventId)
        });
    }
}

const database = new FirebaseService();
export default database;
