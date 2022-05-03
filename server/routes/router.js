'use strict';
const router = require('express').Router();
const fetch = require('node-fetch');
const ethers = require('ethers');

// ----- Endpoints -----

router.get('/resolveENS', async (req, res) => {
    try {
        const ownerAddr = req.query.wallet;
        const provider = new ethers.providers.JsonRpcProvider('https://old-damp-leaf.quiknode.pro/e07321661f44f21da355d777c2e30a3dd0307474/');
        const address = await provider.resolveName(ownerAddr);
    
        return res.status(200).send({ address });
    } catch (err) {
        console.log('here', err);
        return res.status(400).send(error);
    }

});

router.get('/getNFTs', async (req, res) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      const baseURL = 'https://eth-mainnet.alchemyapi.io/v2/g9Smya-hl_Y40GE4QSq1MjGUHcMpwwD2/getNFTs/';
      const ownerAddr = req.query.wallet;
      const fetchURL = `${baseURL}?owner=${ownerAddr}`;
      
      fetch(fetchURL, requestOptions)
        .then(response => response.json())
        .then(results => {
    
            const getNftsForWallet = `
                SELECT * FROM likedNFTs
                WHERE likes > 1
            `;
            
            db.all(getNftsForWallet, (err2, NFTs) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).send(err2.message);
                }

                const likedNfts = NFTs.reduce((obj, item) => {
                    obj[item.id] = item.likes
                    return obj
                }, {});

                results.ownedNfts.forEach((nft) => {
                    nft.likes = likedNfts[nft.id.tokenId + nft.contract.address] || 0;
                });

                return res.status(200).send(JSON.stringify(results, null, 2));
            });            
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send(error);
        })
});

router.post('/likeNFT', (req, res) => {
    // First check if there is already a stored record for this nft.
    const findSql = `
        SELECT * FROM likedNFTs
        WHERE id = $1
    `;
    db.all(findSql, [req.body.id], (err, likedNfts) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            if (likedNfts.length < 1) {
                // Otherwise create a record starting with 1 like.
                const insertSql = `
                    INSERT INTO
                        likedNFTs(id, token, contract, wallet, likes)
                    VALUES($1, $2, $3, $4, $5)
                `;

                const values = [req.body.id, req.body.token, req.body.contract, req.body.wallet, 1];

                db.run(insertSql, values, (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send(err2.message);
                    }

                    return res.status(200).send(likedNfts);
                });
            } else {
                const match = likedNfts.find(ln => ln.id === req.body.id);

                const updateSql = `
                    UPDATE likedNFTs
                    SET likes = $1
                    WHERE id = $2
                `;
                
                const values = [match.likes += 1, match.id];

                db.run(updateSql, values, (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).send(err2.message);
                    }

                    return res.status(200).send(likedNfts);
                });
            }
        }

    });  
});

module.exports = router;