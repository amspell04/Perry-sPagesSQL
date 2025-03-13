let checkin = false;
let checkout = false;
let count = 0;
let modulename;
let teachstud;
let setmaterial;
let classroom;

document.addEventListener("DOMContentLoaded", async function () {
    let body = document.querySelector("#curr");
    if (!body) return;

    try {
        let response = await fetch("http://127.0.0.1:8000/getdata");
        let data = await response.json();

        let contentbox = document.createElement('div');
        contentbox.className = 'content-box';

        // Module Filter Buttons
        let moduleFilterDiv = document.createElement('div');
        moduleFilterDiv.textContent = 'Filter Modules: ';
        contentbox.appendChild(moduleFilterDiv);

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
         contentbox.appendChild(tsFilterDiv);
 
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
        contentbox.appendChild(gradeFilterDiv);

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
        contentbox.appendChild(materialsFilterInput);

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
});

// document.addEventListener("DOMContentLoaded", async function () {
//     let body = document.querySelector("#curr");
//     if (!body) return;

//     try {
//         let response = await fetch("http://127.0.0.1:8000/getdata");
//         let data = await response.json();

//         let contentbox = document.createElement('div');
//         contentbox.className = 'content-box';

//         let filtermod = document.createElement('input');
//         filtermod.type = 'text';
//         filtermod.placeholder = 'Filter table by module number...';
//         contentbox.appendChild(filtermod);

//         // Add filter input
//         let filterInput = document.createElement('input');
//         filterInput.type = 'text';
//         filterInput.placeholder = 'Filter table by material names...';
//         contentbox.appendChild(filterInput);

//         let table = document.createElement("table");
//         table.style.borderCollapse = "collapse";

//         let thead = document.createElement("thead");
//         let headerRow = document.createElement("tr");
//         ["Grade", "Module", "Type", "Materials", "Copy Number", "Available"].forEach(headerText => {
//             let th = document.createElement("th");
//             th.textContent = headerText;
//             th.style.border = "1px solid #5da4b6";
//             th.style.padding = "8px";
//             headerRow.appendChild(th);
//         });
//         thead.appendChild(headerRow);
//         table.appendChild(thead);

//         let tbody = document.createElement("tbody");
//         table.appendChild(tbody); //Append tbody here first.
//         contentbox.appendChild(table);
//         body.appendChild(contentbox);

//         function populateTable(filteredData) {
//             tbody.innerHTML = ''; // Clear existing rows
//             filteredData.forEach(row => {
//                 let tr = document.createElement("tr");
//                 row.forEach(cellData => {
//                     let td = document.createElement("td");
//                     td.textContent = cellData;
//                     td.style.border = "1px solid #5da4b6";
//                     td.style.padding = "8px";
//                     tr.appendChild(td);
//                 });
//                 tbody.appendChild(tr);
//             });
//         }

//         populateTable(data); // Initial table population

//         filterInput.addEventListener('input', function () {
//             const filterValue = filterInput.value.toLowerCase();
//             const filteredData = data.filter(row => {
//                 return row.some(cellData => {
//                     if (typeof cellData === 'string' || typeof cellData === 'number') {
//                         return String(cellData).toLowerCase().includes(filterValue);
//                     }
//                     return false;
//                 });
//             });
//             populateTable(filteredData);
//         });

//         filtermod.addEventListener('input', function () {
//             const filterValue = filtermod.value.toLowerCase();
//             const filteredData = data.filter(row => {
//                 return row.some(cellData => {
//                     if (typeof cellData === 'string' || typeof cellData === 'number') {
//                         return String(cellData).toLowerCase().includes(filterValue);
//                     }
//                     return false;
//                 });
//             });
//             populateTable(filteredData);
//         });

//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// });


  document.addEventListener("DOMContentLoaded", async function () {
  let body = document.querySelector("#checks"); 
  if (!body) return;

  try {
    let response = await fetch("http://127.0.0.1:8000/getcheckoutlist"); 
    let data = await response.json();
    let div = document.createElement("div");
    div.className = 'checkout-box';

    data.forEach(row => {
      let rowchild = document.createElement('div');
      rowchild.className = 'checkout-row';
      rowchild.textContent = `Checkout ID: ${row}`;
      div.appendChild(rowchild);
      rowchild.addEventListener('click', () =>{
      console.log('here will be the implementation to open a popup with the current checkout id and details', row)
    })
    });

   

    body.appendChild(div);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
});


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


const process = document.querySelector(`#processcheck`)
process.addEventListener('click', async() =>{
    console.log('check processed')
    checkin = true
    if(checkin){
        let mod = document.querySelector(`#modname`)
        let modvalue = mod.value // should also be a button
        console.log('module being checked in', modvalue)

        let ts = document.querySelector(`#teachstud`)
        let tsvalue = ts.value // this should be a button instead
        console.log('teacher or student set being checked in', tsvalue)

        let set = document.querySelector(`#setname`)
        let setvalue = set.value // this should be a button instead
        console.log('set materials being checked in', setvalue)

        let cl = document.querySelector(`#classroom`)
        let classvalue = cl.value 
        console.log('classroom checking in', classvalue)

        checkin = !checkin

        const bookToCheckout = {
            el_grade: "1",
            module_num: "1",
            student_teacher: "Student",
            materials: "Dot",
            numcheck: 2,
        };
        process_checkout(bookToCheckout)
    }
    if(checkout){
        let mod = document.querySelector(`#modname`)
        let modvalue = mod.value // should also be a button
        console.log('module being checked out', modvalue)


        let ts = document.querySelector(`#teachstud`)
        let tsvalue = ts.value // this should be a button instead
        console.log('teacher or student set being checked out', tsvalue)

        let set = document.querySelector(`#setname`)
        let setvalue = set.value // this should be a button instead
        console.log('set materials being checked out', setvalue)

        let cl = document.querySelector(`#classroom`)
        let classvalue = cl.value 
        console.log('classroom checking out', classvalue)

        checkout = !checkout
      

    }

    //resetting variable values
    count = 0;
    resetchecknum(count);
    modulename  = '';
    teachstud = '';
    setmaterial = '';
    classroom = ''; 

})



function resetchecknum(count){
    const checkoutnum = document.querySelector('#checkin-num')
    checkoutnum.textContent = `${count}`; 
}
