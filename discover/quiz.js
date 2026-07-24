/**
 * author thebadlorax
 * created on 24-07-2026-17h-39m
 * github: https://github.com/thebadlorax
 * copyright 2026
*/

const data = {
    "questions": [
        {
            "information": "information written here #1",
            "answer": 0
        }
    ]
}

let session_data = {
    "curr_questions": 0
}

const options = [
    document.getElementById("opt1"),
    document.getElementById("opt2"),
    document.getElementById("opt3"),
    document.getElementById("opt4"),
]

const informationCardDiv = document.getElementById("info-div");

// <div class="card" style="padding-bottom: 8vh; padding-top: 8vh; margin-bottom: 2vh">information written here</div>
const generateNewInformationCard = (txt) => {
    const new_ele = document.createElement("div");
    new_ele.classList.add("card")
    new_ele.textContent = txt;
    new_ele.style.paddingBottom = "8vh";
    new_ele.style.paddingTop = "8vh";
    new_ele.style.marginBottom = "2vh";

    informationCardDiv.appendChild(new_ele);
    new_ele.scrollIntoView({ 
        behavior: "smooth",
        block: "center",
        inline: "nearest"
    });
}

options[0].addEventListener("click", () => { 
    session_data.curr_questions += 1;
    generateNewInformationCard(data.questions[session_data.curr_questions])
})

generateNewInformationCard(data.questions[session_data.curr_questions])