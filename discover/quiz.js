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
            "information": "A 73-year-old has experienced a gradual decline in memory over the past three years. They frequently repeat questions, forget recent conversations, and have increasing difficulty remembering names, but their personality and movement have remained largely unchanged.",
            "answer": 0,
            "wrong_expl": {
                "opt1": "Brain imaging shows no evidence of strokes or reduced blood flow.",
                "opt2": "The patient has never experienced visual hallucinations or Parkinson-like movement symptoms.",
                "opt3": "Behavioral and personality changes did not appear early in the disease.",
                "opt4": "Memory loss was the earliest and most prominent symptom."
            },
            "correct_expl": "Correct! Alzheimer's disease usually begins with a slow, progressive decline in memory before affecting other thinking abilities."
        },
        {
            "information": "A 77-year-old developed noticeable cognitive problems after suffering multiple strokes. Their thinking abilities worsened suddenly after each stroke instead of declining steadily over time.",
            "answer": 1,
            "wrong_expl": {
                "opt1": "The patient has a long history of high blood pressure and diabetes, both major stroke risk factors.",
                "opt2": "Their symptoms remain stable for months before suddenly worsening again.",
                "opt3": "Brain scans reveal multiple areas of damage caused by interrupted blood flow.",
                "opt4": "The pattern of decline closely follows cerebrovascular events."
            },
            "correct_expl": "Correct! Vascular dementia is commonly caused by reduced blood flow to the brain and often progresses in a stepwise pattern after strokes."
        },
        {
            "information": "A 75-year-old frequently sees people in the house who are not actually there. Some days they are alert and engaged, while on other days they are extremely confused. They also have a shuffling walk and muscle stiffness.",
            "answer": 2,
            "wrong_expl": {
                "opt1": "Memory loss is present but was not the earliest or most noticeable symptom.",
                "opt2": "The patient has no history of strokes or vascular disease.",
                "opt3": "The personality changes are mild compared with the hallucinations and movement problems.",
                "opt4": "The combination of visual hallucinations, fluctuating attention, and Parkinson-like symptoms is highly characteristic."
            },
            "correct_expl": "Correct! Lewy body dementia is characterized by visual hallucinations, fluctuating cognition, and Parkinson-like movement symptoms."
        },
        {
            "information": "A 61-year-old has begun acting impulsively, making inappropriate jokes, and showing little empathy toward family members. Despite these personality changes, their memory remains relatively intact.",
            "answer": 3,
            "wrong_expl": {
                "opt1": "Memory problems developed much later than the behavioral changes.",
                "opt2": "Brain scans show no evidence of strokes or vascular injury.",
                "opt3": "The patient has never experienced visual hallucinations or Parkinson-like symptoms.",
                "opt4": "The earliest symptoms involve behavior, judgment, and personality rather than memory."
            },
            "correct_expl": "Correct! Frontotemporal dementia typically affects the frontal and temporal lobes first, causing early changes in behavior, personality, and decision-making."
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