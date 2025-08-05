const resetButton = document.querySelector(".reset-button");
const billInput = document.querySelector(".bill");
const peopleInput = document.querySelector(".people")
const buttonsContainer = document.querySelector(".percentages-selection");
const percentButtonsArray = Array.from(buttonsContainer.querySelectorAll("button"));
const customPercentInput = document.querySelector(".custom");
const tipAmountLabel = document.getElementById("tip-amount");
const totalLabel = document.getElementById("total");
const inputs = Array.from(document.querySelectorAll("input"));
const form = document.getElementById("form");

let percentage = 0;
let isValid = false;
let isEmpty = false;

const calculations = { // the same trick we learned but in a different use
  tip: (bill) => bill * percentage / 100,
  tipAmount: (tip, people) => parseFloat(tip / people),
  total:  (tip, bill, people) => parseFloat((tip * 1 + bill * 1) / people || bill / people), // * 1 to make it a number not a string
}

const validations ={ // ik its only 2 cases but im just trying to use the new trick
  bill: value => value > 0,
  percentage: value => value >= 0,
  people: value => value > 0,
}

 // needed in error rendering (i was gonna do a way more complicated route but then i remembered this :)) )
const keyToElement = {
  bill: billInput,
  percentage: customPercentInput,
  people: peopleInput,
}
// i just realised that i abused this list thingy hehe

// btw this is copied, im too lazy to rewrite it, atleast i understand how it works!!
const dataIsValid = (key, value, validations) => {
  if(!validations[key]) return true;

  return validations[key](value);
}
// you give it the name of the field and it will add the error to it
const renderError = name => {
  const parent = keyToElement[name].closest(".form-section");
  if (parent){
    parent.classList.add("error");
  }
}

// same but this removes the error
const removeError = name =>{
  const parent = keyToElement[name].closest(".form-section");
  if (parent){
   parent.classList.remove("error"); 
  }
}

const formIsValid = (form, validations) => { // i made it so when its checking if the form is valid or not, it will give errors in the way since were are checking the validity so yeah
  const data = Object.fromEntries(new FormData(form));
  isEmpty = true
  isValid = true
  Object.keys(data).forEach((name) => {   
    // pass in the validations to `dataIsValid` as the third argument
    if (data[name] !== ""){
      isEmpty = false
    }
    if(dataIsValid(name, data[name], validations)) {
      removeError(name);
    }
    else{
      renderError(name);
      isValid = false
    }
  });
}

const resetLabels = () =>{
  totalLabel.textContent = "$0.00";
  tipAmountLabel.textContent = "$0.00";
}

// updates the text (just adding the "$" to it)
const updateText = (element, text) =>{
  element.textContent = `$${text}`;
}

// this line got used alot so yeah (dont ask me why i didnt do the unactive version)
const activateElement = (element) =>{
  element.classList.add("active");
}

const removeActiveButtons = () =>{ // this line got used 3 time so it deserved a function
  percentButtonsArray.forEach(button => button.classList.remove('active'));
}

const update = () =>{
  if (!isValid) return;

  const bill = billInput.value;
  const people = peopleInput.value ?? 1;
  const tip = calculations["tip"](bill);
  const tipAmount = calculations["tipAmount"](tip, people);
  const total = calculations["total"](tip, bill, people);

  updateText(tipAmountLabel, tipAmount.toFixed(2));
  updateText(totalLabel, total.toFixed(2));
  if (people === ""){
    resetLabels();
  }
}

const checkError = input =>{
  if (!dataIsValid("money", input, validations)){
    resetLabels();

  }
}

// reests everything
const reset = () =>{
  removeActiveButtons();
  inputs.forEach(input =>{
      input.value = "";
    });
  resetLabels();
  resetButton.classList.remove("active");
  Object.keys(keyToElement).forEach(key =>{ // loops through all the fields
    removeError(key);
  })
  percentage = 0;
}

// prevents the annoying effects of submitting
document.addEventListener("submit", (event) =>{
  event.preventDefault(event);
});

// makes the button active when i type something
document.addEventListener("input", event =>{
  formIsValid(form, validations);
  if (isValid){
    update();
  }
  if (isEmpty && !buttonsContainer.querySelector(".active")){ // if there is no button clicked and the fields are empty, the reest button will be off
    resetButton.classList.remove("active")
  }
  else{ // if not enable it
    activateElement(resetButton);
  }
});

// whenever one of the percent buttons get clicked, it becomes active, clears the input area, updates the percentage variable and update the results
percentButtonsArray.forEach(button =>{ 
  button.addEventListener("click", event =>{
    removeActiveButtons();
    activateElement(event.target)
    activateElement(resetButton)
    customPercentInput.value = "";
    percentage = event.target.textContent.replace("%", "")
    update();
  })
})

// it just removes the active buttons and updates the percentage value cuz there is an event listener that detects all input changes so no need to redo it here
customPercentInput.addEventListener("input", event =>{
  removeActiveButtons();
  percentage = event.target.value
})

// reest button, straightforward
resetButton.addEventListener("click", () =>{
  if (resetButton.classList.contains("active")){
    reset();
  }

});
