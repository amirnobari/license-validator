import { WebSocketServer } from 'ws'

import { config } from 'dotenv'
config()

const wss = new WebSocketServer( {
    host: process.env.APP_HOSTNAME,
    port: +( process.env.APP_PORT as string )
} )

// آرایه‌ای برای ذخیره اطلاعات کلاینت‌ها
const database: any = {
    'jhasdbawd51658hjkad54': {
        ws: null,
        username: "client_1",
        licenseId: "5165kadbsfhjbe541ga"
    }
    ,
    '7468s4f66asf6fa6fsa46saf': {
        ws: null,
        username: "client_2",
        licenseId: "as54d6asd4a4sd8asd685"
    }
}

wss.on( 'connection', function connection ( ws, req: any )
{
    ws.on( 'error', console.error )

    let clientId: string = req.headers.user_id

    database[ clientId ].ws = ws

    ws.on( 'message', function message ( message: any )
    {
        const JsonData: any = new TextDecoder( 'utf-8' ).decode( message )
        const data: any = JSON.parse( JsonData )

        console.log( 'received:', data )
        console.log( `User ${ data.userId } Connected.` )
    } )

    if ( clientId == 'jhasdbawd51658hjkad54' )
    {
        for ( const usersInfo in database )
        {
            if ( usersInfo == clientId )
            {
                const ws = database[ usersInfo ].ws
                if ( ws )
                    ws.send( `Hi From Server` )
            }
        }
    }

    ws.on( 'close', () =>
    {
        console.log( `Client ${ clientId } has disconnected` )
    } )
} )









