## Steps to run ##

In a terminal with node JS installed:

<pre><code>$ cd client
$ npm i
$ npm run build
$ cd ..
$ cd server
$ npm i
$ npm run start</code></pre>

Go to http://localhost:1337/ in your browser.

## Technologies used ##

For the backend I’m using Express.js. I’m calling out to the Alchemy API to retrieve NFT metadata. In order to get the ENS validation working I needed to have an Ethereum provider to connect to, so I quickly setup an instance with Quicknode for easier hand-off of the code challenge. 

To store the like count I am using Sqlite3 so a DB instance is quickly accessible with nothing more than an NPM install. I kept it simple and used a token + contract combination as my unique id key. That way if a token is like in one wallet and moved to another one the token’s like count is retained. 

The front-end is built using Vue3. I’m using Vite to speed up my development setup and Tailwind CSS to get a quick and good looking UI.

I learned through this process that IPFS provided images are tricky to work with. My code covers a good majority of different formats provided and pipes in through IPFS.io mostly to retrieve the image content. I can see how Opensea and other marketplaces have their own versions stored and cached for speed.


## Testing strategy ##

The testing strategy I would use here would be manual, and the cases I would test for are below:

Happy path test:

- A user can search for an ENS name and retrieve a collection.

- A user can enter a wallet address and retrieve a collection.

- A user can enter a valid ENS name or wallet address that does not own any NFTs and a message describing this will be present.

- A user can hover under the title of the NFT to see a tooltip with more info.

- A user can like an NFT from a collection.

- A user can like an NFT as many times as they would like.

- A user can filter NFTs by title using the search filter in the top-right corner.

- A user can clear out a filter by clicking the X icon in the filter bar and expect the loaded NFT collection to be completely presented again.

- A user can click the X icon in the top-most search bar to clear out the collection displayed and expect to go back to the empty state of the app.

- Note: If an NFT is transferred to a different wallet, the like count will carry over.

Handled errors:

- A user can enter an invalid ENS name and expect an error message.
- A user can enter an invalid wallet address and expect an error message.
- A user can enter random text and expect an error message.

## Things I would work on next ##

I noticed a slight stutter when clicking the Like button, probably some weird Vue reactivity bug that time did not allow for me to get to in this build.

I’d also like to change the wallet address associated with the contract if a search finds that the ownership changed. 
