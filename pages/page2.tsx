import Link from 'next/dist/client/link'
import Head from 'next/head'
import React from 'react'
import { useAuthentication } from '../hooks/authentication'

export default function Home() {
    const { user } = useAuthentication()

    return (
        <div>
            <Head>
                <title>Page2</title>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>

            <p>{user?.uid || '未ログイン'}</p>
            <Link href="/">
                <a>Go Back</a>
            </Link>
        </div>
    )
}