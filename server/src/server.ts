import { WebSocketServer } from 'ws'

// آرایه‌ای برای ذخیره اطلاعات کلاینت‌ها
const database: any = []

const wss = new WebSocketServer( { port: 8080 } )

// تابع تولید شناسه کلاینت
function generateClientId ()
{
    // بر اساس طول آرایه clients و زمان فعلی یک شناسه یکتا تولید می‌کند
    return database.length.toString() + Date.now().toString()
}

wss.on( 'connection', function connection ( ws )
{
    ws.on( 'error', console.error )
    let clientId: string = ''

    ws.on( 'message', function message ( message: any )
    {

        const JsonData: any = new TextDecoder( 'utf-8' ).decode( message )
        const data: any = JSON.parse(JsonData)


        console.log( 'received:', data )
        console.log( `User ${ data.userId } Connected.` )
        // ذخیره اطلاعات کلاینت
        const client = {
            id: data.userId,
            socket: ws
        }
        clientId = data.userId
        database.push( client )
    } )

    ws.send( `Hi From Server` )

    ws.on( 'close', () =>
    {
        console.log( `Client ${ clientId } has disconnected` )
        // حذف اطلاعات کلاینت از آرایه
        const index = database.findIndex( ( client: any ) => client.id === clientId )
        if ( index !== -1 )
        {
            database.splice( index, 1 )
        }
    } )
} )









