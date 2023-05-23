import WebSocket from 'ws'

import { config } from 'dotenv'
config()

const ws = new WebSocket(`${process.env.URL_CONNECTION}`)

ws.on( 'error', console.error )

ws.on( 'open', function open ()
{
    const JsonData = JSON.stringify({
        username:"client_2",
        userId: "7468s4f66asf6fa6fsa46saf",
        licenseId: "as54d6asd4a4sd8asd685"
    })
    const bufferData=Buffer.from(JsonData)
    ws.send( bufferData )
} )

ws.on( 'message', function message ( data )
{
    console.log( 'received: %s', data )
} )