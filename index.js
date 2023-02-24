const mineflayer = require('mineflayer')
const { Worker, isMainThread } = require('worker_threads');
var colors = require('colors/safe');
var center = require('center-align');

const { Webhook } = require('discord-webhook-node');

const config = require("./config.json");
const hook = new Webhook(config.webhook_url);

if (isMainThread) {
    console.clear();
    process.stdout.write(
        String.fromCharCode(27) + "]0;" + "AstolfoScraper" + String.fromCharCode(7)
    );
    console.log(center(colors.magenta("\n\n\n  ▄▀▀█▄   ▄▀▀▀▀▄  ▄▀▀▀█▀▀▄  ▄▀▀▀▀▄   ▄▀▀▀▀▄     ▄▀▀▀█▄    ▄▀▀▀▀▄   ▄▀▀▀▀▄  ▄▀▄▄▄▄   ▄▀▀▄▀▀▀▄  ▄▀▀█▄   ▄▀▀▄▀▀▀▄  ▄▀▀█▄▄▄▄  ▄▀▀▄▀▀▀▄ \n▐ ▄▀ ▀▄ █ █   ▐ █    █  ▐ █      █ █    █     █  ▄▀  ▀▄ █      █ █ █   ▐ █ █    ▌ █   █   █ ▐ ▄▀ ▀▄ █   █   █ ▐  ▄▀   ▐ █   █   █ \n  █▄▄▄█    ▀▄   ▐   █     █      █ ▐    █     ▐ █▄▄▄▄   █      █    ▀▄   ▐ █      ▐  █▀▀█▀    █▄▄▄█ ▐  █▀▀▀▀    █▄▄▄▄▄  ▐  █▀▀█▀  \n ▄▀   █ ▀▄   █     █      ▀▄    ▄▀     █       █    ▐   ▀▄    ▄▀ ▀▄   █    █       ▄▀    █   ▄▀   █    █        █    ▌   ▄▀    █  \n█   ▄▀   █▀▀▀    ▄▀         ▀▀▀▀     ▄▀▄▄▄▄▄▄▀ █          ▀▀▀▀    █▀▀▀    ▄▀▄▄▄▄▀ █     █   █   ▄▀   ▄▀        ▄▀▄▄▄▄   █     █   \n▐   ▐    ▐      █                    █        █                   ▐      █     ▐  ▐     ▐   ▐   ▐   █          █    ▐   ▐     ▐   \n                ▐                    ▐        ▐                          ▐                          ▐          ▐                  \n\n\n\n\n"), process.stdout.columns));

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let delay = config.delay;

    readline.question('Amount > ', amount => {
        console.log("Scraping " + amount + " pictures!");
        readline.close();
        (function myLoop(i) {
            setTimeout(function() {
                new Worker(__filename);

                process.stdout.write(
                    String.fromCharCode(27) + "]0;" + "AstolfoScraper [" + (amount-i) + "/" + amount + " pictures] [" + delay + "ms delay]" + String.fromCharCode(7)
                    );  
                        
                if (--i) myLoop(i);
            }, delay)
            })(amount);
    });
    
} else {
    async function doTheSilly(){
        console.log(colors.gray("Started scraping images"));
        
        const ratings = config.nsfwSetting;
        let imageUrl = "";

        let data = undefined;

        const response = await fetch('https://astolfo.rocks/api/v1/images/random/' + ratings[Math.floor(Math.random() * ratings.length)], {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        data = await response.json();
        console.log(colors.magenta("Received image: https://astolfo.rocks/astolfo/" + data.id + "." + data.file_extension));

        hook.send("https://astolfo.rocks/astolfo/" + data.id + "." + data.file_extension);

        console.log(colors.gray("Sent image https://astolfo.rocks/astolfo/" + data.id + "." + data.file_extension + " to webhook!"));
    }

    doTheSilly();
}