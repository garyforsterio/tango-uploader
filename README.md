Tango Uploader
===============================


Created to easily upload new words to a [memrise](https://memrise.com) course along with information and audio (is available) from http://jisho.org


## Setup 
1. Copy `.env.example` to `.env` and input the values as specified below
2. Ensure you have both node and npm installed. If not follow instructions [here](https://nodejs.org/en/download/)
3. Install dependencies using `npm install`
4. Add new words you would like added to `./words.js`
5. Run the script using `npm run`

## Config

These values need to be populated in a `./.env` file. See `./.env.example` for a template

#### SESSION_ID_2
> This value is obtained from your memrise cookie in your browser

#### CSRF_TOKEN
> Equally get this value from your memrise cookie

#### LEVEL_ID
> Get this value from the URL of the edit page for your course on memrise


### Example
```
SESSION_ID_2=8caaaa4qwbl2dkxhkhijem8b1jlsp2x7i
CSRF_TOKEN=fcxjaaaaaT6hTiTBYz55VTObrlnYt1vj8z8C21dGJjXKqV9WeJYrC2uQS1euPbvw
LEVEL_ID=1111111
```


## Author
Gary Forster

> Website: [https://www.garyforster.io/](https://www.garyforster.io/)

> Email: [<gary@garyforster.io>](mailto:gary@garyforster.io)