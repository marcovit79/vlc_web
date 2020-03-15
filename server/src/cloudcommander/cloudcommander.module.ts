import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { IncomingMessage, Server } from "http";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import cloudcmd = require('cloudcmd');
import { ConfigModule, ConfigService } from "@nestjs/config";

@WebSocketGateway()
class SocketIoServerHolder {

    @WebSocketServer() 
    private server: Server;

    getServer(): Server {
        return this.server;
    }
}

@Module({
    imports: [ ConfigModule ],
    controllers: [],
    providers: [SocketIoServerHolder],
})
export class CloudCommanderModule implements NestModule  {

    private cloudcommanderConfig: any;

    constructor( 
        private serverHolder: SocketIoServerHolder,
        private readonly configService: ConfigService
    ) { 
        this.cloudcommanderConfig =  { ... cloud_commander_base_config, root: configService.get<String>('fs.cloudcmd_root') }
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply( 
            function( req: IncomingMessage, resp, next) {
                //console.log( req.url );
                if( req.url.startsWith( '/socket.io/socket.io.js' ) ) {
                    resp.redirect( '' + req.url );
                }
                else {
                    next();
                }
            },
            cloudcmd({
                socket: this.serverHolder.getServer(),
                config: this.cloudcommanderConfig
            })
        )
        .forRoutes('/cloudcommander/');
    }

}


var cloud_commander_base_config = {
    "name": "La tua musica",
    "auth": false,
    "username": "",
    "password": "",
    "algo": "",
    "editor": "edward",
    "packer": "tar",
    "diff": true,
    "zip" : true,
    "buffer": true,
    "dirStorage": false,
    "online": false,
    "open": false,
    "keysPanel": true,
    "port": 8000,
    "ip": null,
    "root": "",
    "prefix": "/",
    "prefixSocket": "",
    "contact": false,
    "confirmCopy": true,
    "confirmMove": true,
    "configDialog": false,
    "configAuth": false,
    "oneFilePanel": false,
    "console": false,
    "syncConsolePath": false,
    "terminal": false,
    "terminalPath": "",
    "terminalCommand": "",
    "terminalAutoRestart": true,
    "showConfig": false,
    "showFileName": true,
    "vim": false,
    "columns": "name-size-date-owner-mode",
    "export": false,
    "exportToken": "root",
    "import": false,
    "importToken": "root",
    "importUrl": "http://localhost:8000",
    "importListen": false,
    "log": true,
    "dropbox": false,
    "dropboxToken": ""
}