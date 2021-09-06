//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
const ORDER_BY_PROD_COUNT = "Cant.";
const ORDER_ASC_BY_PRECIO = "Precio ascendente"
const ORDER_DESC_BY_PRECIO = "Precio descendente"
const ORDER_BY_relevancia = "masVendidos";
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
let categoriesArray = [];
const busqueda = document.querySelector("#search");

document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            categoriesArray = resultObj.data;
            sortAndShowProduct(ORDER_ASC_BY_PRECIO, categoriesArray);
        }
    });

    document.getElementById("MenorPrecio").addEventListener("click", function () {
        sortAndShowProduct(ORDER_ASC_BY_PRECIO);
    });

    document.getElementById("MayorPrecio").addEventListener("click", function () {
        sortAndShowProduct(ORDER_DESC_BY_PRECIO);
    });


    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProduct(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showCategoriesList();
    });
});


function showCategoriesList(array){
    let htmlContentToAppend = " ";
        
    for(let i = 0; i < categoriesArray.length; i++){
        let category = categoriesArray[i];
        
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
        ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {
        
        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ category.name +`</h4>
                        <small class="text-muted">` + category.soldCount + ` artículos</small>
                    </div>
                        <p class="mb-1">` + category.description + `</p>
                        <p class="mb-1">` + category.currency + " " + category.cost + `</p>
                </div>
            </div>
        </a>
        `
        }
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortProduct(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRECIO) {
        //*Cuando el criterio es por precio, de Menor a Mayor.
        result = array.sort(function (a, b) {
            if(a.cost < b.cost) {
                return -1;
            }
            if (a.cost > b.cost) {
                return 1;
            }
            return 0;
        });
    
    } else if (criteria === ORDER_DESC_BY_PRECIO) {
        //* Cuando el criterio es por precio, de mayor a menor.
        result = array.sort(function (a, b) {
            if (a.cost < b.cost){
                return 1;
            }
            if (a.cost > b.cost) {
                return -1;
            }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);
            if (aCount < bCount) {
                return 1;
            }
            if (aCount > bCount){
                return -1;
            }
            return 0;
        });

} else if (criteria === ORDER_BY_relevancia) {
    result = array.sort(function (a, b) {
        if(a.soldCount > b.soldCount) {
            return -1; }
        if (a.soldCount < b.soldCount) {
            return 1; 
        }
        return 0;
    });

}

return result;
}

function sortAndShowProduct(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        arrayProduct = categoriesArray;
    }

    arrayProduct = sortProduct(currentSortCriteria, arrayProduct);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

search.addEventListener("keyup", searchGo);

function searchGo() {
    let resultadoSearch = "";
    const texto = busqueda.value.toLowerCase();

    for (let product of categoriesArray) {
        let nombre = product.name.toLowerCase();

        if (nombre.indexOf(texto) !== -1) {
            resultadoSearch += `
           <a href="product-info.html" class="list-group-item list-group-item-action">
               <div class="row">
                   <div class="col-3">
                       <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                   </div>
                   <div class="col"> 
                       <div class="d-flex w-100 justify-content-between">
                           <h4 class="mb-1">`+ product.name + `</h4>
                           <small class="text-muted">` + product.soldCount + ` artículos vendidos.</small>
                       </div>
                       <p class="mb-1">` + product.description + `</p>
                       <p class="mb-1">`  + product.currency + " " + product.cost + `</p>
                   </div>
               </div>
           </a>
           `
            document.getElementById("cat-list-container").innerHTML = resultadoSearch;

        }

        if (resultadoSearch === "") {
            document.getElementById("cat-list-container").innerHTML = `
            <div>
                <div class="row">
                    <label> No se ha encontrado coincidencias </label>
                </div>
            <div>
            `

        }
    }

}