import WebSocket from 'ws'

import { config } from 'dotenv'
config()

const ws = new WebSocket( `${ process.env.URL_CONNECTION }` )

ws.on( 'error', console.error )

ws.on( 'open', function open ()
{
    const JsonData = JSON.stringify({
        username:"client_1",
        userId: "jhasdbawd51658hjkad54",
        licenseId: "5165kadbsfhjbe541ga"
    });
    const bufferData=Buffer.from(JsonData)
    ws.send( bufferData )
} )

ws.on( 'message', function message ( data )
{
    console.log( 'received: %s', data )
} )