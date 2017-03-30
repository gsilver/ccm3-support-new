Will need to install

`npm install -g json-proxy` (may need to use sudo)

May need to install other npm dependencies (`colors, http-proxy, morgan, optimist, express`) - just follow the prompts.

Start server with:

`json-proxy -p <PORT> -f “/<EXPRESSION IN FRONT END REQUESTS=<SERVER YOU WANT TO FORWARD THINGS TO> /“`

i.e.:

`json-proxy -p 8081 -f "/api=https://some.server.com/“`

will forward requests like:

`/api/v1/accounts`

to:

`https://some.server.com/api/v1/accounts`

After server starts, go to

[http://localhost:8081/](http://localhost:8081/) or whatever port you started it in.
