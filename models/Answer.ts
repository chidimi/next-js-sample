import { firestore } from "firebase";

export interface Answer {
    id: string
    uid: string
    questionId: string
    body: string
    createdAt: firestore.Timestamp
}