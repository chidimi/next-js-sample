import { firestore } from "firebase"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"
import Layout from "../../components/Layout"
import { useAuthentication } from "../../hooks/authentication"
import { Answer } from "../../models/Answer"
import { Question } from "../../models/Questions"

type Query = {
    id: string
}

export default function QuestionsShow() {
    const router = useRouter()
    const query = router.query as Query
    const { user } = useAuthentication()
    const [question, setQuestion] = useState<Question>(null)
    const [isSending, setIsSending] = useState(false)
    const [body, setBody] = useState('')
    const [answer, setAnswer] = useState<Answer>(null)

    async function loadData() {
        if (query.id === undefined) {
            return
        }
        

        const questionDoc = await firestore()
            .collection('questions')
            .doc(query.id)
            .get()

        if (!questionDoc.exists) {
            return
        }

        const gotQuestion = questionDoc.data() as Question
        gotQuestion.id = questionDoc.id
        setQuestion(gotQuestion)
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSending(true)

        await firestore().runTransaction(async (t) => {
            t.set(firestore().collection('answers').doc(), {
                uid: user.uid,
                questionId: question.id,
                body,
                createdAt: firestore.FieldValue.serverTimestamp(),
            })
            t.update(firestore().collection('questions').doc(question.id), {
                isReplied: true,
            })
        })
        setIsSending(false)
    }

    useEffect(() => {
        loadData()
    }, [query.id])

    return (
        <Layout>
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    {question && (
                        <div className="card">
                            <div className="card-body">{question.body}</div>
                            <section className="text-center mt-4">
                                <h2 className="h4">回答する</h2>
                                <form onSubmit={onSubmit}>
                                    <textarea
                                        className="form-control"
                                        placeholder="おげんきです"
                                        rows={6}
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                    ></textarea>
                                    <div className="m-3">
                                        {isSending ? (
                                            <div className="spinner-border text-secondary" role="status"></div>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                回答する
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}