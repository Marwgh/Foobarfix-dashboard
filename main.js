import './style.scss'
var checkbox = document.querySelector('input[name=mode]');
let beerTot =  0;
let queueItemes = [];

checkbox.addEventListener('change', function() {
    if(this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
        document.querySelector("#mode").innerHTML = "Light Mode";
         document.querySelector(".logo").src = "./Images/logolight.png";
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
        document.querySelector(".logo").src = "./Images/logo.png";
        document.querySelector("#mode").innerHTML = "Dark Mode";
    }
});

pageLoad();

function pageLoad(){
    loadData(); 
    getOrder();
}
function loadData (){
    fetch("https://beer-bar.herokuapp.com/")
    .then(r => r.json())
    .then (jsonData => {
        // loaded --> prepare objects   
        console.log(jsonData);
        prepIfos(jsonData);
    });
}
function getOrder() {

    fetch("https://foobar-1293.restdb.io/rest/foormidable", {
        method: "get",
        headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "60a4dea0e3b6e02545edaa5d",
                "cache-control": "no-cache",
            },
    })
        .then((e) => e.json())
        .then((data) => { 
            document.querySelector(".orderList").innerHTML=""; 
            data.forEach(showOrder);
            showTabels(data);
        });
}

function showOrder(order) {
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);
    copy.querySelector(".numberOrder").textContent = order._id.substring(6,10);
    copy.querySelector(".tableOrder").textContent = order.table_id;
    document.querySelector(".orderList").appendChild(copy);
}



function prepIfos(data) {
    let servedC = [];
    let queue = data.queue ;
    document.querySelector("#tapsDisplay").innerHTML="";
    /**/
    data.taps.forEach(element =>{
        const newtap = document.querySelector("#tapsTemplate").content;
        const copy = newtap.cloneNode(true);
        let liquidPourcent = (element.level/2500);

        if (window.matchMedia('(max-width: 1100px)').matches) {
            copy.querySelector(".liquidDiv").style.height = 24 *liquidPourcent +"vw";
        }else {
            copy.querySelector(".liquidDiv").style.height = 11 *liquidPourcent +"vw";
        }
        //let lightfull = copy.querySelector(".liquidDiv").offsetHeight;
        element.beer =  element.beer.replaceAll(" ", "");
        copy.querySelector("img").src= "./Images/"+element.beer.toLowerCase()+".png";
        copy.querySelector("img").alt=element.beer.toLowerCase();
        document.querySelector(".liquidDiv")
        document.querySelector("#tapsDisplay").appendChild(copy);
        
    })
    data.bartenders.forEach(element => {
        document.querySelector("#"+element.name+ " .bartendname").innerHTML = element.name;
        document.querySelector("#"+element.name+ " .bartendStat").innerHTML = "Status : "+ element.statusDetail;
        document.querySelector("#"+element.name+ " .bartendServd").innerHTML = "Serving client : "+ element.servingCustomer;
        servedC.push(element.servingCustomer);
    }); 

    if (servedC.length===3){
        servedC.sort();

        document.querySelector(".served").innerHTML = servedC[0] -1 ;
    }
    document.querySelector(".waiting").innerHTML = queue.length;      
    queue.forEach( element =>{
        if (queueItemes.findIndex((item) => item.id === element.id) === -1){
            beerTot += element.order.length ;
            console.log("elements are not here");
        }
    });
    queueItemes = queue ;
    document.querySelector(".sold").innerHTML = beerTot;
    wait();
}



function showTabels(orders) {
    console.log(orders);
    orders.forEach(element => {
        document.querySelector( ".t"+ element.table_id.substring(5)+ " .notification").classList.remove("hide");
        document.querySelector( ".t"+ element.table_id.substring(5)+ " .notification + img").classList.add("orderwating");
        
    });
    document.querySelectorAll(".orderwating").forEach(x => x.addEventListener("click", modaleShow));
    
    function modaleShow (event) {
        console.log(event.target);
        let table = event.target.alt;
        console.log(table);
        document.querySelector("#modal").innerHTML="";
        orders.forEach( order => {
            if (order.table_id == table){
                console.log("yes");
                populationing(order);
            }
        
        });
        document.querySelector("#closingButton").classList.remove("hide"); 
        document.querySelector("#modal").classList.remove("hide");


        
    function populationing (order) {
        
        const newodermod = document.querySelector("#modaleTempl").content;
        const copy = newodermod.cloneNode(true);
        copy.querySelector("h2").textContent= order.table_id;
        copy.querySelector("p").textContent =  "#"+ order._id.substring(6,10);
        order.beers.forEach( beer => {
            const newbeer = document.querySelector("#beerOrderTemp").content;
            const clone = newbeer.cloneNode(true);
            clone.querySelector(".beername").textContent = beer.name;
            clone.querySelector(".orderAmoute").textContent = beer.amount;
            clone.querySelector(".orderPrice").textContent = beer.price + "dkk";
            copy.querySelector(".orders").appendChild(clone);
        });
        copy.querySelector(".optionsbut").id =order._id;
        document.querySelector("#modal").appendChild(copy);
        
        
    }
    
    document.querySelectorAll(".optionsbut").forEach(x => x.addEventListener("click", delet))

    document.querySelector("#closingButton").addEventListener("click" , () => {
        document.querySelector("#modal").classList.add("hide"); 
        document.querySelector("#closingButton").classList.add("hide"); 
    })
}
}

function delet () {
    
    let id = event.target.id ;
    console.log(id);
    
    fetch("https://foobar-1293.restdb.io/rest/foormidable/"+id , {
        method: "delete",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "60a4dea0e3b6e02545edaa5d",
            "cache-control": "no-cache",
        },
    })
    .then((res)=> res.json())
    .then((data)=> console.log(data));
}



function wait() {
    setTimeout(loadData,5000);
    setTimeout(getOrder,10000);

}
// Random Time
const liquid = document.querySelectorAll(".liquidDiv");
liquid.forEach((x) => {
    const time = Math.random() * 1000 + 0.2;
    x.style.setProperty('--animation-time', time +'s');
});
