var arrayOfObjects = [{
    question: "What is 2+2?",
    answer: "4"
},
{
    question: "What is 27x3?",
    answer: "81"
},
{
    question: "What's the first prime number?",
    answer: "2"
},
{
    question: "What's the probability of flipping a coin 5 times and landing heads in every try?",
    answer: "3.125%"
},
{
    question: "What's 23x10",
    answer: "230"
},
{
    question: "What's 21+10",
    answer: "31"
},
{
    question: "What's 23-5",
    answer: "18"
},
{
    question: "What's 12+19",
    answer: "31"
},
{
    question: "What's 9x12",
    answer: "108"
},
{
    question: "What's 8*13",
    answer: "104"
},
{
    question: "What's 27x11",
    answer: "297"
},

{
    question: "What's 81+29",
    answer: "110"
},
{
    question: "What is the Capital of South Africa",
    options: [
        "Doha",
        "Washington D.C.",
        "Ottowa",
        "Santiago",
        "Cape Verdict"

    ],
    answer: "Cape Town"

}
];

document.addEventListener("DOMContentLoaded", function () {
    var scoreUI = document.getElementById("Score");
    var submitting = document.getElementById("Submit");
    var questionsList = document.getElementById("Questions");

    function displayQuestions() {
        questionsList.innerHTML = '';
        arrayOfObjects.forEach(function (questionObject, index) {
            var listItem = document.createElement('li');
            listItem.textContent = questionObject.question; // refers to arrayofobjects
            listItem.appendChild(breakLine())

            if (questionObject.hasOwnProperty("options")) {
                const radioForm = createRadioQuestion(questionObject.question, questionObject.options, questionObject.answer);
                listItem.appendChild(radioForm)
            } else {
                const fieldQuestion = createFieldQuestion(questionObject.question, questionObject.answer);
                listItem.appendChild(fieldQuestion);
            }

            questionsList.appendChild(listItem) // adds listItem to the end of list

        }) // better than for loop

    }

    scoreUI.innerHTML = "??/" + arrayOfObjects.length; // setting the score to x out of the length of the array

    displayQuestions(); // calling function
    submitting.addEventListener('click', function () {
        var score = 0;
        for (let i = 0; i < arrayOfObjects.length; i++) {
            const question = arrayOfObjects[i]['question'];
            const answer = arrayOfObjects[i]['answer'];
            const element = document.getElementsByName(question)[0];
            if (element.tagName === 'FORM') {
                const selectedOption = element.querySelector('input[type="radio"]:checked').value;
                if (selectedOption === answer)
                    score++;

            } else {
                if (element.value === answer)
                    score++;
            }
        }
        scoreUI.innerHTML = score + "/" + arrayOfObjects.length;
    })


})


function createRadioOption(question, option) {
    const component = document.createElement('div');
    const optionInput = document.createElement('input');
    const label = document.createElement('label');
    optionInput.setAttribute('type', 'radio');
    optionInput.setAttribute('value', option);
    optionInput.setAttribute('name', question + "1");
    label.innerText = option

    component.appendChild(optionInput);
    component.appendChild(label);
    component.appendChild(breakLine());
    return component
}

function createRadioQuestion(question, options, answer) {
    const randomIndex = Math.floor(Math.random() * (options.length));
    const form = document.createElement('form');
    form.setAttribute('name', question);
    for (option of options) {
        const radioOptionComponent = createRadioOption(question, option);
        form.appendChild(radioOptionComponent);
    }

    const radioOptionComponent = createRadioOption(question, answer);
    const toInsertBefore = form.childNodes[randomIndex];
    form.insertBefore(radioOptionComponent, toInsertBefore);
    return form;
}

function breakLine() {
    return document.createElement('br');
}

function createFieldQuestion(question, answer) {
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'answer' + question); // giving an ID to make it easier to access later on.
    input.setAttribute('placeholder', 'Enter your answer'); // translucent text, simply placeholder for user.
    input.setAttribute('name', question);

    return input;
}