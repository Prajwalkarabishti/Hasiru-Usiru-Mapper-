// ===============================
// CREATE MAP CENTERED ON INDIA
// ===============================

var map = L.map('map', {

    center: [20.5937, 78.9629],

    zoom: 5,

    minZoom: 5,

    maxBounds: [

        [6.0, 68.0],
        [38.0, 98.0]

    ]

});

// ===============================
// OPEN STREET MAP LAYER
// ===============================

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{
    attribution: '© OpenStreetMap'
}

).addTo(map);

// ===============================
// LOAD SAVED TREES
// ===============================

let trees =
JSON.parse(localStorage.getItem("trees")) || [];

// ===============================
// SHOW SAVED TREES ON MAP
// ===============================

trees.forEach(tree => {

    let popupContent =

        "<b>Tree:</b> " + tree.name +

        "<br><b>Location:</b> " + tree.location +

        "<br><b>Species:</b> " + tree.type +

        "<br><img src='" + tree.image +

        "' width='150' height='100'>";

    L.marker([tree.lat, tree.lng])

    .addTo(map)

    .bindPopup(popupContent);

});

// ===============================
// UPDATE DASHBOARD
// ===============================

updateDashboard();

// ===============================
// DISPLAY TREE LIST
// ===============================

displayTrees();

// ===============================
// SAVE TREE FUNCTION
// ===============================

function saveTree(){

    let name =
    document.getElementById("treeName").value;

    let location =
    document.getElementById("treeLocation").value;

    let type =
    document.getElementById("treeType").value;

    let image =
    document.getElementById("treeImage").files[0];

    if(name == "" || location == ""){

        alert("Please Enter All Details");

        return;
    }

    if(!image){

        alert("Please Upload Image");

        return;
    }

    let reader = new FileReader();

    reader.onload = function(e){

        let imageData = e.target.result;

        navigator.geolocation.getCurrentPosition(

        function(position){

            let lat = position.coords.latitude;

            let lng = position.coords.longitude;

            L.marker([lat,lng])

            .addTo(map)

            .bindPopup(name)

            .openPopup();

            trees.push({

                name:name,
                location:location,
                type:type,
                image:imageData,
                lat:lat,
                lng:lng

            });

            localStorage.setItem(

                "trees",
                JSON.stringify(trees)

            );

            updateDashboard();

            displayTrees();

            document.getElementById("treeName").value = "";

            document.getElementById("treeLocation").value = "";

            document.getElementById("treeImage").value = "";

            alert("Tree Saved Successfully");

        });

    };

    reader.readAsDataURL(image);

}

// ===============================
// UPDATE DASHBOARD FUNCTION
// ===============================

function updateDashboard(){

    let totalTrees = trees.length;

    let oxygen = totalTrees * 10;

    document.getElementById("treeCount")
    .innerHTML = totalTrees;

    document.getElementById("oxygenScore")
    .innerHTML = oxygen;

}

// ===============================
// DISPLAY TREES FUNCTION
// ===============================

function displayTrees(filteredTrees = trees){

    let treeList =
    document.getElementById("treeList");

    treeList.innerHTML = "";

    if(filteredTrees.length === 0){

        treeList.innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger">

                No Trees Found

            </div>

        </div>

        `;

        return;
    }

    filteredTrees.forEach((tree,index) => {

        treeList.innerHTML += `

        <div class="col-md-4 mb-4">

            <div class="card shadow">

                <img src="${tree.image}"
                class="card-img-top"
                style="height:220px;
                object-fit:cover;">

                <div class="card-body">

                    <h3 class="text-success">

                        ${tree.name}

                    </h3>

                    <p>

                        <b>Location:</b>
                        ${tree.location}

                    </p>

                    <p>

                        <b>Species:</b>
                        ${tree.type}

                    </p>

                    <!-- EDIT BUTTON -->

                    <button
                    class="btn btn-primary w-100 mb-2"
                    onclick="editTree(${index})">

                    Edit Tree

                    </button>

                    <!-- DELETE BUTTON -->

                    <button
                    class="btn btn-danger w-100"
                    onclick="deleteTree(${index})">

                    Delete Tree

                    </button>

                </div>

            </div>

        </div>

        `;
    });

}

// ===============================
// EDIT TREE FUNCTION
// ===============================

function editTree(index){

    let tree = trees[index];

    let newName =
    prompt("Edit Tree Name", tree.name);

    let newLocation =
    prompt("Edit Location", tree.location);

    let newType =
    prompt("Edit Species", tree.type);

    if(newName && newLocation && newType){

        trees[index].name = newName;

        trees[index].location = newLocation;

        trees[index].type = newType;

        localStorage.setItem(

            "trees",
            JSON.stringify(trees)

        );

        displayTrees();

        alert("Tree Updated Successfully");

    }

}

// ===============================
// SEARCH TREE FUNCTION
// ===============================

function searchTrees(){

    let searchText =

    document.getElementById("searchInput")

    .value.toLowerCase();

    let filteredTrees = trees.filter(tree =>

        tree.name.toLowerCase().includes(searchText) ||

        tree.location.toLowerCase().includes(searchText) ||

        tree.type.toLowerCase().includes(searchText)

    );

    displayTrees(filteredTrees);

}

// ===============================
// DELETE SINGLE TREE
// ===============================

function deleteTree(index){

    let confirmDelete =

    confirm("Are you sure to delete this tree?");

    if(confirmDelete){

        trees.splice(index,1);

        localStorage.setItem(

            "trees",
            JSON.stringify(trees)

        );

        updateDashboard();

        displayTrees();

        alert("Tree Deleted Successfully");

    }

}

// ===============================
// DELETE ALL TREES
// ===============================

function clearTrees(){

    let confirmDelete =

    confirm("Delete All Trees?");

    if(confirmDelete){

        localStorage.removeItem("trees");

        location.reload();

    }

}

// ===============================
// SHOW CURRENT USER LOCATION
// ===============================

navigator.geolocation.getCurrentPosition(function(position){

    let lat = position.coords.latitude;

    let lng = position.coords.longitude;

    L.marker([lat,lng])

    .addTo(map)

    .bindPopup("📍 You Are Here")

    .openPopup();

    map.setView([lat,lng],13);

});