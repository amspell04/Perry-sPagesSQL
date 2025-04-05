let checkin = true;
let checkout = false;
let count = 0;
let elgrade;
let modulenum;
let ts;
let material;
let classroom;
let numcopies;
let data;

const checkinbuttons = {}; 
const checkinstatus = document.querySelector('#checkin')
const newcheckout = document.querySelector('#newcheckout')
const checkoutstatus = document.querySelector('#checkout')
const process = document.querySelector('#processcheck')
let checkinenabled = false
let checkoutenabled = false

document.addEventListener("DOMContentLoaded", async() =>{
    const dataresponse = await getdatalist();
    console.log(dataresponse);
    const checkresponse = await getcheckoutlist();
    console.log(checkresponse);

});


async function getdatalist() {
    let body = document.querySelector("#curr");
    if (!body) return;

    try {
        let response = await fetch("http://127.0.0.1:8000/getdata");
        data = await response.json();

        let contentbox = document.createElement('div');
        contentbox.className = 'content-box';

        let toolbar = document.querySelector(`#toolbar`)

        // Module Filter Buttons
        let moduleFilterDiv = document.createElement('div');
        moduleFilterDiv.className = 'filter'
        moduleFilterDiv.textContent = 'Filter Modules: ';
        moduleFilterDiv.style.font = "caption";
        toolbar.appendChild(moduleFilterDiv);

        // Get unique module numbers
        const uniqueModules = [...new Set(data.map(row => row[1]))]; 

        const moduleButtons = {}; 

        let modulebtnDiv = document.createElement('div');
        modulebtnDiv.className = 'smallbtns'
        uniqueModules.forEach(module => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = module;
            button.addEventListener('click', () => {
                moduleButtons[module] = !moduleButtons[module]; 
                button.classList.toggle('selected');
                applyFilters();
            });
            modulebtnDiv.appendChild(button);
            moduleButtons[module] = false; 
        });
        moduleFilterDiv.appendChild(modulebtnDiv);


         // Teacher/Student Filter Buttons
         let tsFilterDiv = document.createElement('div');
         tsFilterDiv.className = 'filter'
         tsFilterDiv.textContent = 'Filter Teacher/Student: ';
         tsFilterDiv.style.font = "caption";
         toolbar.appendChild(tsFilterDiv);
 
         // Get unique module numbers
         const uniqueVals = [...new Set(data.map(row => row[2]))]; 
 
         const tsButtons = {}; 
 

        let tsbuttondiv = document.createElement('div');
        tsbuttondiv.className = 'mediumbtns'
         uniqueVals.forEach(module => {
             const button = document.createElement('button');
             button.className = 'filterbuttons'
             button.textContent = module;
             button.addEventListener('click', () => {
                 tsButtons[module] = !tsButtons[module]; 
                 button.classList.toggle('selected');
                 applyFilters();
             });
             tsbuttondiv.appendChild(button);
             tsButtons[module] = false; 
         });
        tsFilterDiv.appendChild(tsbuttondiv);

        
        // Grade filter buttons
        let gradeFilterDiv = document.createElement('div');
        gradeFilterDiv.className = 'filter'
        gradeFilterDiv.textContent = 'Filter Grades: ';
        gradeFilterDiv.style.font = "caption";
        toolbar.appendChild(gradeFilterDiv);

        // Get unique module numbers
        const uniqueGrades = [...new Set(data.map(row => row[0]))]; 

        const gradeButtons = {}; 

        let gradebtndiv = document.createElement('div');
        gradebtndiv.className = 'smallbtns'
        uniqueGrades.forEach(module => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = module;
            button.addEventListener('click', () => {
                gradeButtons[module] = !gradeButtons[module]; 
                button.classList.toggle('selected');
                applyFilters();
            });
            gradebtndiv.appendChild(button);
            gradeButtons[module] = false;
        });
        gradeFilterDiv.appendChild(gradebtndiv);


        // Materials Filter Input
        let materialsFilterInput = document.querySelector('#filtermat');
      

        let table = document.createElement("table");
        table.style.borderCollapse = "collapse";

        let thead = document.createElement("thead");
        let headerRow = document.createElement("tr");
        ["Grade", "Module", "Type", "Materials", "Copy Number", "Available"].forEach(headerText => {
            let th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid #5da4b6";
            th.style.padding = "8px";
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        contentbox.appendChild(table);
        body.appendChild(contentbox);

        function populateTable(filteredData) {
            tbody.innerHTML = '';
            filteredData.forEach(row => {
                let tr = document.createElement("tr");
                row.forEach(cellData => {
                    if (cellData === "Available") {
                        let td = document.createElement("td");
                        td.style.border = "1px solid #5da4b6";
                        td.style.padding = "8px";
                        td.style.color = "#228B22";
                        td.style.fontWeight = "bold";
                        td.style.textAlign = "center";
                        td.textContent = "Available"
                        tr.appendChild(td);

                    }else if
                    (cellData === "Unavailable"){
                        let td = document.createElement("td");
                        td.style.border = "1px solid #5da4b6";
                        td.style.padding = "8px";
                        td.style.color = "#C70039";
                        td.style.fontWeight = "bold";
                        td.style.textAlign = "center";
                        td.textContent = "Unavailable"
                        tr.appendChild(td);
                    }else{
                    let td = document.createElement("td");
                    td.textContent = cellData;
                    td.style.border = "1px solid #5da4b6";
                    td.style.padding = "8px";
                    tr.appendChild(td);

                    }

                });
                tbody.appendChild(tr);
            });
        }

        populateTable(data);

        function applyFilters() {
            const selectedModules = Object.keys(moduleButtons).filter(module => moduleButtons[module]);
            const selectedGrades = Object.keys(gradeButtons).filter(grade => gradeButtons[grade]);
            const selectedTS = Object.keys(tsButtons).filter(teachstud => tsButtons[teachstud]);

            const materialsFilterValue = materialsFilterInput.value.toLowerCase();

            const filteredData = data.filter(row => {
                const grade = String(row[0]);
                const module = String(row[1]);
                const ts = String(row[2]);
                const materials = String(row[3]).toLowerCase();

                let gradeMatch = true;
                let tsMatch = true;
                let moduleMatch = true;
                let materialsMatch = true;

                if (selectedModules.length > 0) {
                    moduleMatch = selectedModules.includes(module);
                }
                if (selectedGrades.length > 0) {
                    gradeMatch = selectedGrades.includes(grade);
                }
                if (selectedTS.length > 0) {
                    tsMatch = selectedTS.includes(ts);
                }
                if (materialsFilterValue) {
                    materialsMatch = materials.includes(materialsFilterValue);
                }

                return moduleMatch && materialsMatch && gradeMatch && tsMatch;
            });

            populateTable(filteredData);
        }

        materialsFilterInput.addEventListener('input', applyFilters);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getcheckoutlist() {
  let body = document.querySelector("#checks"); 
  if (!body) return;

  try {
    let response = await fetch("http://127.0.0.1:8000/getcheckoutlist"); 
    let checkoutdata = await response.json();
    let div = document.createElement("div");
    div.className = 'checkout-box';


    let table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    ["ID", "Materials", "# of Copies", "Classroom",  "Check In"].forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        th.style.border = "1px solid #5da4b6";
        th.style.padding = "8px";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    div.appendChild(table);
    body.appendChild(div);

    let checkoutFilterInput = document.querySelector('#filtercheck');
    checkoutFilterInput.addEventListener('input', applyFilters);

    console.log(checkoutdata)
    populateCheckoutTable(checkoutdata)

    function applyFilters() {

        const checkoutFilterValue = checkoutFilterInput.value.toLowerCase();

        const filteredData = checkoutdata.filter(row => {
            const classroom = String(row[3]).toLowerCase();

            let classroommatch = true;

    
            if (checkoutFilterValue) {
                classroommatch = classroom.includes(checkoutFilterValue);
            }

            return classroommatch;
        });
        populateCheckoutTable(filteredData);

    }

    body.appendChild(div);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function populateCheckoutTable(filteredData) {
    const tbody = document.querySelector("#checks table tbody");
    tbody.innerHTML = '';

    for (let row of filteredData) {
        let tr = document.createElement("tr");

        row.forEach(cellData => {
            let td = document.createElement("td");
            td.textContent = cellData;
            td.style.border = "1px solid #5da4b6";
            td.style.padding = "8px";
            if (td.cellData != "Check In"){
                td.addEventListener('click', getmodal)
            }
            tr.appendChild(td);
        });

        // Modal click event
        async function getmodal() {
            var modal = document.getElementById("myModal");
            modal.style.display = "block";

            let response = await fetch("http://127.0.0.1:8000/getmodalcontent");
            let data = await response.json();

            let modalcontent = document.querySelector('.modal-content');
            modalcontent.innerHTML = " "
            let table = document.createElement("table");
            table.className = 'modaltable';
            table.style.borderCollapse = "collapse";

            let thead = document.createElement("thead");
            let headerRow = document.createElement("tr");
            ["ID", "Grade", "Module", "Type", "Materials", "# of Copies", "Classroom", "Notes", "Checkout Date"].forEach(headerText => {
                let th = document.createElement("th");
                th.textContent = headerText;
                th.style.border = "1px solid #5da4b6";
                th.style.padding = "8px";
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            let modalTbody = document.createElement("tbody");
            table.appendChild(modalTbody);

            data.forEach(dataRow => {
                if (dataRow[0] == row[0]) {
                    let tr = document.createElement("tr");
                    dataRow.forEach(cellData => {
                        let td = document.createElement("td");
                        td.textContent = cellData;
                        td.style.border = "1px solid #5da4b6";
                        td.style.padding = "8px";
                        tr.appendChild(td);
                    });
                    modalTbody.appendChild(tr);
                }
            });
   
            modalcontent.appendChild(table);
        };

        // Add "Check In" button to each row
        let buttonCell = document.createElement("td");
        buttonCell.style.border = "1px solid #5da4b6";
        buttonCell.style.padding = "8px";

        let btn = document.createElement("button");
        btn.textContent = 'Check In';
        btn.style.border = "1px solid #5da4b6";
        btn.style.padding = "8px";

        btn.addEventListener("click", async function() {
            modal.style.display = "none";
            console.log("Check In button clicked for row:", row);

            try {
                const checkinresponse = await fetch("http://127.0.0.1:8000/addcheckin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        check_id: row[0],
                        materials: row[1],
                        num_checked: row[2],
                        classroom: row[3],
                    }),
                });

                if (checkinresponse.ok) {
                    alert("Checkin processed successfully!");

                    // Refresh checkout table
                    const checkoutListResponse = await getcheckoutlist();
                    console.log(checkoutListResponse);

                    // Refresh main table
                    const updatedDataResponse = await getdatalist();
                    console.log(updatedDataResponse);

                } else {
                    alert("Failed to process checkin.");
                }
            } catch (error) {
                console.error("Error processing checkin:", error);
                alert("An error occurred during checkin.");
            }
        });

        buttonCell.appendChild(btn);
        tr.appendChild(buttonCell);

        // Append row to tbody
        tbody.appendChild(tr);
    }
}


const checkinup = document.querySelector('#increasein');
checkinup.addEventListener('click', () =>{
  count += 1;
  resetchecknum(count);


});

const checkindown = document.querySelector('#decreasein');
checkindown.addEventListener('click', () =>{
  if(count > 0){
    count -= 1;
  }
  resetchecknum(count);


});


// CHECKOUT TAB

document.addEventListener("DOMContentLoaded", async function () {
    console.log('adding checkout features');

    try {
        let response = await fetch("http://127.0.0.1:8000/getdata");
        data = await response.json();

        const process = document.querySelector('#processcheck');

        let set = document.querySelector(`#set`);
        let cl = document.querySelector(`#classroom`);
        let notes = document.querySelector(`#notes`);

        const searchInput = document.getElementById('set');
        const suggestionsList = document.getElementById('suggestions');


        function populateSuggestions(inputValue) {
            suggestionsList.style.display = 'block';
            suggestionsList.innerHTML = '';

            if (inputValue.length === 0) {
                return;
            }

            const uniqueMaterials = new Set();

            const filteredTitles = data.filter(row => {
                const materials = String(row[3]);
                if (materials.includes(inputValue)) {
                    if (!uniqueMaterials.has(materials)) {
                        uniqueMaterials.add(materials);
                        return true;
                    }
                }
                return false;
            });

            uniqueMaterials.forEach(material => {
                const listItem = document.createElement('li');
                listItem.className = 'suggestions';
                listItem.textContent = material;
                listItem.addEventListener('click', () => {
                    searchInput.value = material;
                    suggestionsList.innerHTML = '';
                    suggestionsList.style.display = 'none';
                });
                suggestionsList.appendChild(listItem);
            });
        }

        searchInput.addEventListener('input', () => {
            populateSuggestions(searchInput.value);
        });

        document.addEventListener('click', (event) => {
            if (event.target !== searchInput && event.target !== suggestionsList) {
                suggestionsList.innerHTML = '';
            }
        });

        process.addEventListener('click', async () => {
            const material = set.value;
            const classroom = cl.value;
            const numCheck = count;
            const newnote = notes.value;

            if (!material || !classroom || numCheck <= 0) {
                alert("Please fill in all checkout details.");
                return;
            }

            // Find matching data rows
            const matchingItems = data.filter(row => row[3] === material);

            if (matchingItems.length === 0) {
                alert("Material not found.");
                return;
            }

            const totalAvailable = matchingItems.reduce((sum, item) => sum + ( item[5] == "Available"), 0);

            if (totalAvailable >= numCheck) {
                // Process checkout
                const firstMatchingItem = matchingItems[0];
                const elGrade = firstMatchingItem[0];
                const moduleNum = firstMatchingItem[1];
                const ts = firstMatchingItem[2];

                try {
                    const checkoutResponse = await fetch("http://127.0.0.1:8000/addcheckout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            el_grade: elGrade,
                            module_num: moduleNum,
                            student_teacher: ts,
                            materials: material,
                            num_checked: numCheck,
                            classroom: classroom,
                            notes: newnote,
                        }),
                    });

                    if (checkoutResponse.ok) {
                        alert("Checkout processed successfully!");
                
                        // Refresh checkout table
                        const checkoutListResponse = await getcheckoutlist();
                        console.log(checkoutListResponse)
                
                        // Refresh main table
                        const updatedDataResponse = await getdatalist();
                        console.log(updatedDataResponse)
                
                        // // Update the main table data and repopulate
                        // data = updatedData; // Update the global data variable
                        // applyFilters(); // Reapply filters to update the main table
                
                    } else {
                        alert("Failed to process checkout.");
                    }
                } catch (error) {
                    console.error("Error processing checkout:", error);
                    alert("An error occurred during checkout.");
                }
            } else {
                alert(`Insufficient resources. Available: ${totalAvailable}, Requested: ${numCheck}`);
            }
        });

    } catch (error) {
        console.log('error grabbing data', error);
    }

    count = 0;
    resetchecknum(count);
});

function resetchecknum(count) {
    const checkoutnum = document.querySelector('#checkin-num');
    checkoutnum.textContent = `${count}`;
}


// modal controls

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}