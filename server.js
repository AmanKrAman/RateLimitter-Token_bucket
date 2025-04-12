const express = require('express');
const app = express();
const PORT = 5003;

let tokens = 3;
const capacity = 3;
const refilrate = 1;
let lastrefil = Date.now();

function refillToken(){
    const now = Date.now();
    const secondsPassed = (now - lastrefil) / 1000;
    const tokensToAdd = Math.floor(secondsPassed * refilrate);

    if(tokensToAdd > 0){
        tokens = Math.min(capacity, tokens + tokensToAdd);
        lastrefil = now;
    }
}

function ratelimitter(req , res, next){
    refillToken();

    if(tokens>0){
        tokens--;
        next();
    }else{
        res.status(429).send("Too many requests - Try again later")
    }
}

app.get('/',ratelimitter , (req, res) => {
    res.send("Request allowed")
});

app.listen(PORT , () => {
    console.log('Server running at localhost: 5003')
})
