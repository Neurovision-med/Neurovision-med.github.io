/**
 * author thebadlorax
 * created on 24-07-2026-17h-39m
 * github: https://github.com/thebadlorax
 * copyright 2026
*/

const COLORS = {
    "correct": "green",
    "wrong": "red",
    "wrong-info": "white"
}

const data = {
    "questions": [
        {
            "information": "information written here #1",
            "answer": 0,
            "wrong_expl": {
                "opt1": "another piece of info 1",
                "opt2": "another piece of info 2",
                "opt3": "another piece of info 3",
                "opt4": "another piece of info 4",
            },
            "correct_expl": "you were right because dementia"
        },
        {
            "information": "information written here #2",
            "answer": 1,
            "wrong_expl": {
                "opt1": "second piece of info 1",
                "opt2": "second piece of info 2",
                "opt3": "second piece of info 3",
                "opt4": "second piece of info 4",
            },
            "correct_expl": "you were right also because of dementia"
        },
        {
            "information": "information written here #3",
            "answer": 2,
            "wrong_expl": {
                "opt1": "third piece of info 1",
                "opt2": "third piece of info 2",
                "opt3": "third piece of info 3",
                "opt4": "third piece of info 4",
            },
            "correct_expl": "you were right amazingly because of dementia"
        },
    ]
}

let session_data = {
    "curr_question": 0,
    "mode": 0,
    "stats": {
        "corrects": 0,
        "wrongs": 0
    },
    "temp": {
        "wrong_choices": []
    }
}

const options = [
    document.getElementById("opt1"),
    document.getElementById("opt2"),
    document.getElementById("opt3"),
    document.getElementById("opt4"),
]

const informationCardDiv = document.getElementById("info-div");
const makeAChoice = document.getElementById("mac");

// <div class="card" style="padding-bottom: 8vh; padding-top: 8vh; margin-bottom: 2vh">information written here</div>
const generateNewInformationCard = (txt, options={"paddingBottom": "8vh", "paddingTop": "8vh", "marginBottom": "2vh", "color": "white"}) => {
    const new_ele = document.createElement("div");
    new_ele.classList.add("card")
    new_ele.textContent = txt;
    new_ele.style.paddingBottom = options.paddingBottom;
    new_ele.style.background = options.color;
    new_ele.style.paddingTop = options.paddingTop;
    new_ele.style.marginBottom = options.marginBottom;

    informationCardDiv.appendChild(new_ele);
    new_ele.scrollIntoView({ 
        behavior: "smooth",
        block: "center",
        inline: "nearest"
    });
}

const handleAnswer = (question, option, optionEle) => {
    if(question.answer == option) {
        generateNewInformationCard(question.correct_expl, {"paddingBottom": "5vh", "paddingTop": "5vh", "marginBottom": "6vh", "color": COLORS.correct})
        optionEle.style.background = COLORS.correct;
        session_data.stats.corrects += 1;
        session_data.mode = 1;
        makeAChoice.textContent = "click any to continue"
    } else {
        generateNewInformationCard(question.wrong_expl[`opt${option+1}`], {"paddingBottom": "5vh", "paddingTop": "5vh", "marginBottom": "2vh", "color": COLORS["wrong-info"]})
        optionEle.style.background = COLORS.wrong;
        session_data.stats.wrongs += 1;
        optionEle.classList.remove("card");
        optionEle.classList.add("card-nh");
        optionEle.style.cursor = "default"
        session_data.temp.wrong_choices.push(option);
    }
}
const progress = () => {
    makeAChoice.textContent = "make a choice";
    session_data.mode = 0;
    options.forEach(o => {
        o.style.background = "white";
        o.classList.remove("card-nh", "card");
        o.classList.add("card");
    })
    session_data.curr_question += 1;
    session_data.temp.wrong_choices.length = 0;
    console.log(session_data.curr_question, data.questions.length)
    if(session_data.curr_question >= data.questions.length) {
        handleEnd();
    } else {
        generateNewInformationCard(data.questions[session_data.curr_question].information);
    }
}

const handleEnd = () => {
    generateNewInformationCard(`wrong answers: ${session_data.stats.wrongs}`)
    document.getElementById("answer-container").style.display = "none";
}

options.forEach((o, index) => {
    o.addEventListener("click", () => {
        if(session_data.mode == 0) {
            if(!session_data.temp.wrong_choices.includes(index)) handleAnswer(data.questions[session_data.curr_question], index, o)
        } else {
            progress();
        }
    })
})

generateNewInformationCard(data.questions[session_data.curr_question].information)