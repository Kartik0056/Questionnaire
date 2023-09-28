 // Sample data to store questions and answers
 let questions = JSON.parse(localStorage.getItem("questions")) || [];
 let radioGroupIndex = 0;

 const questionsList = document.getElementById("questions");
 const questionInput = document.getElementById("question");
 const answerInput = document.getElementById("answer");
 const answerTypeSelect = document.getElementById("answer-type");
 const addBtn = document.getElementById("add-btn");
 const editBtn = document.getElementById("edit-btn");
 const deleteBtn = document.getElementById("delete-btn");
 const fileType = document.getElementById('flieInput');

 fileType.addEventListener('change',function(event){
    var file=(event.target.files[0]);
    answerInput.value += file.name; 
})
 
  
 // Function to display questions
    function displayQuestions() { 
         questionsList.innerHTML = "";
         questions.forEach((item, index) => {
         const div2 = document.createElement("form");
         const div3 = document.createElement('div');
         const h3  = document.createElement('h3');
         const SeltBtn = document.createElement('button');
         SeltBtn.innerText ="Select";
         SeltBtn.title = "Select For Edit or Delete"
         SeltBtn.type="button";
         SeltBtn.classList.add('SeltctBtn');
         div3.classList.add('mainDiv');
         div2.classList.add('radioButtonDiv');
         let h3St =  h3.innerHTML = `<strong data-index="${index}">${index + 1}. ${item.question} ?</strong>`;
         
         div3.innerHTML = `${h3St} <span class="spanDiv">${renderAnswer(item.answer, item.answerType, index)}</span>`
   
         SeltBtn.addEventListener("click", () => selectQuestion(index));
         questionsList.appendChild(div2);
         div2.appendChild(div3);
         div3.appendChild(SeltBtn)
        //  div3.appendChild(h3)

        //Select Button for Edit or Delete Questions
        SeltBtn.addEventListener('focus',()=>{
            SeltBtn.classList.add('active')
           
        });
        SeltBtn.addEventListener('blur',()=>{
            SeltBtn.classList.remove('active')
           
        });
     });
     //End 

     // Store the updated data in localStorage
     localStorage.setItem("questions", JSON.stringify(questions));
 }
 

            // Function to render answers (text or images) with support for images
            function renderAnswer(answerArray, answerType, questionIndex) {
                return answerArray.map((answer, index) => {
         if (answerType === "text") {
             return ` <div class="toolbar">
             <button type="button" onclick="toggleFormatting('bold', this);"><i class="fas fa-bold"></i></button>
             <button type="button" onclick="toggleFormatting('italic', this);"><i class="fas fa-italic"></i></button>
             <button type="button" onclick="toggleFormatting('underline', this);"><i class="fas fa-underline"></i></button>
             <label for="font-family">Font Family:</label>
             <select id="font-family" onchange="document.execCommand('fontName', false, this.value,${questionIndex});">
                 <option value="Select Fonts">Select Fonts</option>
                 <option value="Arial, sans-serif">Arial</option>
                 <option value="Times New Roman, serif">Times New Roman</option>
                 <option value="Courier New, monospace">Courier New</option>
                 <option value="verdana,sens-serif">Verdana</option>
                 <option value="Candara,sens-serif">Candara</option>
             </select>
             <label for="text-color">Text Color:</label>
             <input type="color" id="text-color" onchange="changeTextColor(this.value,${questionIndex});">

             <!-- Add the font size select tag -->
             <label for="font-size">Font Size:</label>
             <select id="font-size" onchange="changeFontSize(this.value,${questionIndex});">
                 <option value="12px">12</option>
                 <option value="14px">14</option>
                 <option value="16px">16</option>
                 <option value="18px">18</option>
                 <option value="20px">20</option>
                 <option value="22px">22</option>
                 <option value="24px">24</option>
                 <option value="26px">26</option>
                 <option value="28px">28</option>
                 <option value="30px">30</option>
                 <option value="32px">32</option>
                 <option value="34px">34</option>
                 <!-- Add more sizes here -->
             </select>
             </div><div contenteditable="true" data-index="${questionIndex}" class="text-editor" ${questionIndex} name="answer${questionIndex}" value="${answer}"></div>`;
             
         } 
         else if(answerType === 'Stext'){
            return `<input type="${answerType = "text"}" class="Stext" name="answer${questionIndex}" value="${answer}">`;

         }
         else if (answer.match(/\.(jpeg|jpg|gif|png)$/i)) {
             // If answer is an image URL
             
             return `<input type="${answerType}" name="answer${questionIndex}" value="${answer}"><img class="answer-image" src="${answer}" alt="Image Answer">`;
         }
         else if (answerType === "radio" || answerType === "checkbox") {
             
             const optionLabel = String.fromCharCode(97 + index); // Convert to letters (a, b, c, ...)
             return `<input type="${answerType}" name="answer${questionIndex}" value="${optionLabel}"> ${answer}`;
         } 
     }).join("");
 }

      

             
 // Function to add a new question
 addBtn.addEventListener("click", () => {
     const question = questionInput.value;
     const answer = answerInput.value;
     const answerType = answerTypeSelect.value;

     if (question && answer) {
         let answerArray = [];

         if (answerType === "text") {
             // If the answer type is text, split the input by comma and trim
             answerArray = answer.split(",").map(item => item.trim());
         } 
         else if (answerType === "radio" || answerType === "checkbox") {
            //  If the answer type is radio or checkbox, create options "a", "b", "c", etc.
             const options = answer.split(",").map(item => item.trim());
              let inpt = document.createElement('input')
              inpt.type='text'
             if (options.length >= 2) {
                 answerArray = options;
             }
         }
        
         

         questions.push({ question, answer: answerArray, answerType });
         displayQuestions();
         clearInputs();
     }
 });

 editBtn.addEventListener("click", () => {
     const selectedIndex = questionsList.querySelector(".selected");
     if (selectedIndex) {
        
         const index = selectedIndex.dataset.index;
         questions[index].question = questionInput.value;
         questions[index].answer = answerInput.value.split(",").map(item => item.trim());
         questions[index].answerType = answerTypeSelect.value;
         displayQuestions();
         clearInputs();
     }
 });

 // Function to delete a selected question
 deleteBtn.addEventListener("click", () => {
     const selectedIndex = questionsList.querySelector(".selected");
     if (selectedIndex) {
         const index = selectedIndex.dataset.index;
         questions.splice(index, 1);
         displayQuestions();
         clearInputs();
     }
 });

 // Function to select a question for editing/deletion
 function selectQuestion(index) {
     
     const selected = questionsList.querySelector("strong");
     
     if (selected) {
         selected.classList.remove("selected");
     }
     const listItem = questionsList.querySelector(`[data-index="${index}"]`);
     listItem.classList.add("selected");
     const selectedItem = questions[index];
     questionInput.value = selectedItem.question;
     answerInput.value = selectedItem.answer.join(", ");
 }

 // Function to clear input fields
 function clearInputs() {
     questionInput.value = "";
     answerInput.value = "";
 }

 // Initial display
    displayQuestions();

 //Editor start 
                // Get the content-editable div
                const textEditor = document.querySelector(`.text-editor`);
                 
                // Store the active button
                let activeButton = null;

                // Add an event listener for input events
                textEditor.addEventListener('input', function () {
                    // Save the content of the div to localStorage
                    localStorage.setItem('text-editor-content', this.innerHTML);
                }); 

                // Check if there is previously saved content in localStorage
                const savedContent = localStorage.getItem('text-editor-content');

                // If there is saved content, load it into the div
                if (savedContent) {
                    textEditor.innerHTML = savedContent;
                    
                }

                // Function to toggle formatting and change button background color
                function toggleFormatting(command, button) {
                    document.execCommand(command, false, null);
                    
                    // Remove the active class from the previously active button
                    if (activeButton) {
                        activeButton.classList.remove('active');
                    }

                    // Toggle the active class on the current button
                    button.classList.toggle('active');

                    // Update the active button
                    activeButton = button;
                }

    // Function to change text color
    function changeTextColor(color) {
        document.execCommand('foreColor', false, color);
    }
   
    function changeFontSize(size) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = size;
            range.surroundContents(span);
        }
    }

//End