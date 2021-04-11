const pup = require("puppeteer");                 
                                                                                     
let flipkartPrice ;                 // stores the price offered by flipkart
let amazonPrice ;                   // stores the price offered by amazon

let flipkartTab;                    // tab for flipkart 
let amazonTab;                      // tab for amazon

async function flipkart(productName) {           // opens flipkart
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: [
            '--window-size=800,800'
          ]
        
    });

    let pages = await browser.pages();
    flipkartTab = pages[0];

    await flipkartTab.goto("https://www.flipkart.com/");
    await flipkartTab.waitForSelector("._2KpZ6l._2doB4z",{visible: true});
    await flipkartTab.click("._2KpZ6l._2doB4z");

    await flipkartTab.click("._3OO5Xc");
    await flipkartTab.type("._3OO5Xc",`${productName}`);
    await flipkartTab.click(".L0Z3Pu");
    
    await flipkartTab.waitForSelector("._30jeq3",{visible: true});
    let results = await flipkartTab.$$("._30jeq3");
    
    let price = await flipkartTab.evaluate(function(ele){
         return ele.textContent;
    },results[0]);

    let finalPrice = "";
    for(let n of price){
        if(n >= '0' && n <= '9'){         // removing commas and rupee symbol
            finalPrice += n;
        }
    }

    flipkartPrice = parseInt(finalPrice);     // return price in integer value
}

async function amazon(productName){         // opens amazon
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: [
            '--window-size=720,800',
            '--window-position=810,10'
          ]
    });

    let pages = await browser.pages();
    amazonTab = pages[0];
    await amazonTab.goto("https://www.amazon.in/");

    await amazonTab.waitForSelector("#twotabsearchtextbox");
    await amazonTab.click("#twotabsearchtextbox");

    await amazonTab.type("#twotabsearchtextbox",`${productName}`);
    await amazonTab.click("#nav-search-submit-button");

    await amazonTab.waitForSelector(".a-price-whole");
    let results = await amazonTab.$$(".a-price-whole");
    let price = await amazonTab.evaluate(function(ele){
        return ele.textContent;                         
    },results[0]);

    let finalPrice = "";
    for(let n of price){
        if(n >= '0' && n <= '9'){         // removing commas 
            finalPrice += n;
        }
    }

    amazonPrice = parseInt(finalPrice);     // return price in integer value
}


async function main(){
    let pname = process.argv.slice(2); 

    let productName = "";
    for(let val of pname){
        productName += val + " ";   // converting pname arr to string
    }

    flipkart(productName);
    amazon(productName);

    await setTimeout(function(){
    console.log("Flipkart Price","----",flipkartPrice);
    console.log("Amazon Price",amazonPrice);
    if(flipkartPrice < amazonPrice){
        console.log("Flipkart Price is Less" ,flipkartPrice);
        amazonTab.close();
        flipkartTab.click(".col.col-7-12");

    }else{
        console.log("Amazon Price is less",amazonPrice);
        flipkartTab.close();
        amazonTab.waitForSelector(".a-size-medium.a-color-base.a-text-normal",{visible: true})
        amazonTab.click(".a-size-medium.a-color-base.a-text-normal");
    }
    },17000); 

}
                      
main();                // you need to pass the product name as argument in command line for execution like this --- "node project.js redmi note 9"
 
