let checkin = true;
let checkout = false;
let count = 0;
let elgrade;
let modulenum;
let ts;
let material;
let classroom;

const checkinbuttons = {}; 
const checkinstatus = document.querySelector('#checkin')
const checkoutstatus = document.querySelector('#checkout')
const process = document.querySelector('#processcheck')
let checkinenabled = false
let checkoutenabled = false

document.addEventListener("DOMContentLoaded", async function () {
    let body = document.querySelector("#curr");
    if (!body) return;

    try {
        let response = await fetch("http://127.0.0.1:8000/getdata");
        let data = await response.json();

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
});

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


// adding checkout functionality features


document.addEventListener("DOMContentLoaded", async function () {
    console.log('adding checkout features')

    try {
        let response = await fetch("http://127.0.0.1:8000/getdata");
        let data = await response.json();

    if(checkin){

        const checkdiv = document.querySelector(`.class-btn`)

        // EL Grade Filter Buttons
        let elcheck = document.createElement('div');
        elcheck.textContent = 'Select EL Grade: ';
        checkdiv.appendChild(elcheck);

        // // Get unique module numbers
        const uniqueEL = [...new Set(data.map(row => row[0]))]; 

        const elButtons = {}; 

        uniqueEL.forEach(row => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = row;
            button.addEventListener('click', () => {
                elButtons[row] = !elButtons[row]; 
                elgrade = row
                console.log('current el grade selected to check', elgrade)
                button.classList.toggle('selected');
                // applyFilters();
            });
            elcheck.appendChild(button);
            elButtons[row] = false; 
        });

        // Module Filter Buttons
        let modcheck = document.createElement('div');
        modcheck.textContent = 'Select Module: ';
        checkdiv.appendChild(modcheck);

        // Get unique module numbers
        const uniqueModules = [...new Set(data.map(row => row[1]))]; 

        const moduleButtons = {}; 

        uniqueModules.forEach(module => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = module;
            button.addEventListener('click', () => {
                moduleButtons[module] = !moduleButtons[module]; 
                modulenum = module
                console.log('current module selected to check',  modulenum)
                button.classList.toggle('selected');
                // applyFilters();
            });
            modcheck.appendChild(button);
            moduleButtons[module] = false; 
        });


        // Teacher/student Filter Buttons
        let tscheck = document.createElement('div');
        tscheck.textContent = 'Select Teacher or Student: ';
        checkdiv.appendChild(tscheck);

        // Get unique teacher/student values
        const uniqueTS = [...new Set(data.map(row => row[2]))]; 

        const tsButtons = {}; 

        uniqueTS.forEach(row => {
            const button = document.createElement('button');
            button.className = 'filterbuttons'
            button.textContent = row;
            button.addEventListener('click', () => {
                tsButtons[row] = !tsButtons[row]; 
                button.classList.toggle('selected');
                ts = row
                console.log('current ts selected to check', ts)
                // applyFilters();
            });
            tscheck.appendChild(button);
            tsButtons[row] = false; 
        });
      
        let set = document.querySelector(`#set`)
        material = set.value 
        console.log('set materials checking', material)
        

        let cl = document.querySelector(`#classroom`)
        classroom = cl.value 
        console.log('classroom checking', classroom)

        checkin = !checkin

        const bookToCheckout = {
            el_grade: elgrade,
            mod_num: modulenum,
            t_s: ts,
            set_materials: material,
            class_name: classroom,
            numcheck: 2,
        };

        let returnavailability = checkavailability();
        // ADD FUNCITON HERE!!

        // here adding in a status to show the user - if not able to process 

        if(returnavailability){
            process_checkout(bookToCheckout)
            // shows successful processing of checkout
        }else{
            // show button and current availability of what is wanting to be checked out
        }

    }
    } catch (error){
        console.log('error grabbing data', error)
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

// button styling for checkin box

checkinstatus.addEventListener('click', ()=>{
    checkinenabled = !checkinenabled
    if(checkinenabled){
        checkoutstatus.classList.add('disabled')
        checkinstatus.classList.add('enabled')
    }else{
        checkinstatus.classList.remove('enabled')
        checkoutstatus.classList.remove("disabled")
    }
});

checkoutstatus.addEventListener('click', ()=>{
    console.log(checkoutenabled, 'current checkout bool'
    )
    checkoutenabled = !checkoutenabled
    if(checkoutenabled){
        checkinstatus.classList.add("disabled")
        checkoutstatus.classList.add('enabled')
    }else{
        checkoutstatus.classList.remove('enabled')
        checkinstatus.classList.remove('disabled')
    }
});



