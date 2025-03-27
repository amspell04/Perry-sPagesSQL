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

// newcheckout.addEventListener('click', () =>{
//     console.log('making smaller')
//     const checkoutbox = document.querySelector('.checkout-box')
//     checkoutbox.style.height = '100px';
// })


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
        moduleFilterDiv.textContent = 'Filter Modules: ';
        toolbar.appendChild(moduleFilterDiv);

        // Get unique module numbers
        const uniqueModules = [...new Set(data.map(row => row[1]))]; 

        const moduleButtons = {}; 

        uniqueModules.forEach(module => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = module;
            button.addEventListener('click', () => {
                moduleButtons[module] = !moduleButtons[module]; 
                button.classList.toggle('selected');
                applyFilters();
            });
            moduleFilterDiv.appendChild(button);
            moduleButtons[module] = false; 
        });

         // Teacher/Student Filter Buttons
         let tsFilterDiv = document.createElement('div');
         tsFilterDiv.textContent = 'Filter Teacher/Student: ';
         toolbar.appendChild(tsFilterDiv);
 
         // Get unique module numbers
         const uniqueVals = [...new Set(data.map(row => row[2]))]; 
 
         const tsButtons = {}; 
 
         uniqueVals.forEach(module => {
             const button = document.createElement('button');
             button.className = 'filterbuttons'
             button.textContent = module;
             button.addEventListener('click', () => {
                 tsButtons[module] = !tsButtons[module]; 
                 button.classList.toggle('selected');
                 applyFilters();
             });
             tsFilterDiv.appendChild(button);
             tsButtons[module] = false; 
         });
        
        // Grade filter buttons
        let gradeFilterDiv = document.createElement('div');
        gradeFilterDiv.textContent = 'Filter Grades: ';
        toolbar.appendChild(gradeFilterDiv);

        // Get unique module numbers
        const uniqueGrades = [...new Set(data.map(row => row[0]))]; 

        const gradeButtons = {}; 

        uniqueGrades.forEach(module => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = module;
            button.addEventListener('click', () => {
                gradeButtons[module] = !gradeButtons[module]; // Toggle button state
                button.classList.toggle('selected');
                applyFilters();
            });
            gradeFilterDiv.appendChild(button);
            gradeButtons[module] = false; // Initialize button state
        });

        // Materials Filter Input
        let materialsFilterInput = document.createElement('input');
        materialsFilterInput.type = 'text';
        materialsFilterInput.placeholder = 'Filter Materials...';
        toolbar.appendChild(materialsFilterInput);

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
                    let td = document.createElement("td");
                    td.textContent = cellData;
                    td.style.border = "1px solid #5da4b6";
                    td.style.padding = "8px";
                    tr.appendChild(td);
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


    console.log(checkoutdata)
    populateCheckoutTable(checkoutdata)

    body.appendChild(div);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


async function populateCheckoutTable(filteredData) {
    const tbody = document.querySelector("#checks table tbody");
    tbody.innerHTML = '';
    filteredData.forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(cellData => {
            let td = document.createElement("td");
            td.textContent = cellData;
            td.style.border = "1px solid #5da4b6";
            td.style.padding = "8px";
            tr.appendChild(td);
        });

        let buttonCell = document.createElement("td");
        buttonCell.style.border = "1px solid #5da4b6";
        buttonCell.style.padding = "8px";
        console.log(' adding button')
        let btn = document.createElement("button");
        btn.textContent = 'Check In';
        btn.style.border = "1px solid #5da4b6";
        btn.style.padding = "8px";

        btn.addEventListener("click", async function() {
            console.log("Check In button clicked for row:", row);
            console.log(' current row in check', row)
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
                    console.log(checkoutListResponse)
            
                    // Refresh main table
                    const updatedDataResponse = await getdatalist();
                    console.log(updatedDataResponse)
            
            
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

        tbody.appendChild(tr);
    });
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

        const searchInput = document.getElementById('set');
        const suggestionsList = document.getElementById('suggestions');

        function populateSuggestions(inputValue) {
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

            const totalAvailable = matchingItems.reduce((sum, item) => sum + item[5], 0);

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

