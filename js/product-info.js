var autosArray = [];
var category = undefined;
var commentsArray = [];
var description = undefined;
var imagesArray = [];
var productCost = undefined;
var productCurrency = undefined;
var productInfoObj = {};
var productName = undefined;
var relatedProducts = [];
var soldCount = undefined;



function showProductInfo() {
    let htmlContentToAppend = `<div id="carouselImages" class="carousel slide bd-placeholder-img card-img-top" data-ride="carousel">
    <div class="carousel-inner" style="margin: auto;">`

    for (let i = 0; i < imagesArray.length; i++) {
        if (i === 0) {
            htmlContentToAppend += `
             <div class="carousel-item active">
             <img class="d-block w-100" src="${imagesArray[i]}" alt="First slide">
             </div>`
        } else {
            htmlContentToAppend += ` <div class="carousel-item">
             <img class="d-block w-100" src="${imagesArray[i]}" alt="Second slide">
           </div>`
        }
    }

    htmlContentToAppend += `
    </div>
    <a class="carousel-control-prev" href="#carouselImages" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselImages" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    </div>
    <div class="card-body">
    <div class="row">
      <div class="col col-8"><h2> ${productCurrency} ${productCost}</h2></div>
      <div class="col col-4"><p>${soldCount} artículos vendidos</p></div>
    </div>
    <div class="row">
       <p>${description}</p> 
    </div>
    <div class="row">
    <div class="col col-3"><b>Categoría: ${category}</b>
    </div>
    </div>`

    document.getElementById('info').innerHTML = htmlContentToAppend;
}

function showProductName() {
    let htmlContentToAppend = `
    <h1> ${productName}</h1>`
    document.getElementById('nombre').innerHTML = htmlContentToAppend;
}

function showRelatedProducts() {
    let htmlContentToAppend = "";
    for (let i = 0; i < autosArray.length; i++) {
        let auto = autosArray[i];
        for (let j = 0; j < relatedProducts.length; j++) {
            if (relatedProducts[j] == i) {
                relatedProducts[j] = auto;
            }
        }


    }
    for (auto of relatedProducts) {
        htmlContentToAppend += `
        <a href="product-info.html" class="linkRelatedProducts">
    <div class="card" style="width: 18rem; margin: 5px">
    <img class="bd-placeholder-img card-img-top" src="${auto.imgSrc}">
    <div class="card-body">
    <h5>${auto.name}</h5>
    </div> 
    </div>
    </a>`
    }
    document.getElementById('relatedProducts').innerHTML = htmlContentToAppend;
}

function sortCommentsArrayByDate() {
    commentsArray.sort((a, b) => {
        return new Date(b.dateTime) - new Date(a.dateTime);
    })
    currentSortCommentsCriteria = 'Fecha';
}

function showComments() {
    let htmlContentToAppend = "";
    for (comment of commentsArray) {
        let score = comment.score;
        let stars = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= score) {
                stars += `<i class="fas fa-star"></i>`;
            } else {
                stars += `<i class="far fa-star"></i>`;
            }
        }
        let fechaSinHora = comment.dateTime.split(' ')[0].split('-')[2] + '/' + comment.dateTime.split(' ')[0].split('-')[1] + '/' + comment.dateTime.split(' ')[0].split('-')[0];
        let horaSinFecha = comment.dateTime.split(' ')[1];
        htmlContentToAppend += `
      <div class="list-group-item list-group-item-action">
      <div class="row">
      <div class="col-6">
      <span class="starRating">${stars} </span><br>
      <span class="userComment">${comment.user}</span>      
      </div>
      <div class="col-2">
      </div>
      <div class="col-4" style="padding-right: 10px; text-align:right;">
      <small>${fechaSinHora}</small><br>
      <small>${horaSinFecha}</small>
      </div>
      </div><br>
      <div class="row">
      <p style="margin: 8px;">${comment.description}</p>
      </div>
      </div>`
    }
    document.getElementById('commentsContainer').innerHTML = htmlContentToAppend;
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj) {
        if (resultObj.status === 'ok') {

            productInfoObj = resultObj.data;
            imagesArray = productInfoObj.images;
            productName = productInfoObj.name;
            productCost = productInfoObj.cost;
            productCurrency = productInfoObj.currency;
            soldCount = productInfoObj.soldCount;
            description = productInfoObj.description;
            category = productInfoObj.category;
            relatedProducts = productInfoObj.relatedProducts;

            showProductName();
            showProductInfo();

        }
    })
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === 'ok') {
            autosArray = resultObj.data;
            showProductInfo();
            showRelatedProducts();

        }

    })

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj) {
        if (resultObj.status === 'ok') {
            commentsArray = resultObj.data;
            sortCommentsArrayByDate();
            showComments();
            nombreUsuarioOpinion();
        }

    })
});