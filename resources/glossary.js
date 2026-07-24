const glossaryTerms = [

    {
        id: "dementia",
        name: "Dementia",
        size: "largest",
        definition: "A general term describing conditions that affect memory, thinking, behavior, and the ability to perform daily activities.",
        links: [
            "alzheimers",
            "vascular-dementia",
            "lewy-body-dementia",
            "frontotemporal-dementia",
            "memory",
            "neuron",
            "diagnosis"
        ]
    },


    {
        id: "alzheimers",
        name: "Alzheimer's Disease",
        size: "large",
        definition: "The most common form of dementia, associated with changes in the brain that affect memory, thinking, and behavior.",
        links: [
            "dementia",
            "amyloid-plaque",
            "tau-protein",
            "memory",
            "hippocampus"
        ]
    },


    {
        id: "vascular-dementia",
        name: "Vascular Dementia",
        size: "medium",
        definition: "A type of dementia caused by problems with blood flow to the brain, often following damage from strokes.",
        links: [
            "dementia",
            "stroke",
            "diagnosis"
        ]
    },


    {
        id: "lewy-body-dementia",
        name: "Lewy Body Dementia",
        size: "medium",
        definition: "A form of dementia associated with abnormal deposits of a protein called alpha-synuclein in brain cells.",
        links: [
            "dementia",
            "neurodegeneration"
        ]
    },


    {
        id: "frontotemporal-dementia",
        name: "Frontotemporal Dementia",
        size: "medium",
        definition: "A group of disorders caused by degeneration of areas of the brain involved in personality, behavior, and language.",
        links: [
            "dementia",
            "neurodegeneration",
            "cognition"
        ]
    },


    {
        id: "memory",
        name: "Memory",
        size: "large",
        definition: "The ability of the brain to store, retain, and recall information.",
        links: [
            "dementia",
            "hippocampus",
            "neuron"
        ]
    },


    {
        id: "cognition",
        name: "Cognition",
        size: "medium",
        definition: "The mental processes involved in acquiring knowledge, thinking, reasoning, and understanding.",
        links: [
            "dementia",
            "memory",
            "frontotemporal-dementia"
        ]
    },


    {
        id: "neuron",
        name: "Neuron",
        size: "large",
        definition: "A specialized cell that communicates information throughout the nervous system.",
        links: [
            "synapse",
            "neurotransmitter",
            "dementia"
        ]
    },


    {
        id: "synapse",
        name: "Synapse",
        size: "small",
        definition: "The connection point where neurons communicate with other cells.",
        links: [
            "neuron",
            "neurotransmitter"
        ]
    },


    {
        id: "neurotransmitter",
        name: "Neurotransmitter",
        size: "small",
        definition: "A chemical messenger that allows neurons to communicate with each other.",
        links: [
            "neuron",
            "synapse"
        ]
    },


    {
        id: "amyloid-plaque",
        name: "Amyloid Plaque",
        size: "medium",
        definition: "A buildup of abnormal protein fragments between brain cells that is studied in relation to Alzheimer's disease.",
        links: [
            "alzheimers",
            "tau-protein"
        ]
    },


    {
        id: "tau-protein",
        name: "Tau Protein",
        size: "medium",
        definition: "A protein that helps maintain neuron structure but can form abnormal tangles in some neurological diseases.",
        links: [
            "alzheimers",
            "amyloid-plaque"
        ]
    },


    {
        id: "hippocampus",
        name: "Hippocampus",
        size: "medium",
        definition: "A brain structure important for learning and forming new memories.",
        links: [
            "memory",
            "alzheimers"
        ]
    },


    {
        id: "diagnosis",
        name: "Diagnosis",
        size: "medium",
        definition: "The process of identifying a medical condition through evaluation, testing, and observation.",
        links: [
            "dementia",
            "mri",
            "biomarker"
        ]
    },


    {
        id: "mri",
        name: "MRI",
        size: "small",
        definition: "A medical imaging technique that creates detailed pictures of structures inside the body.",
        links: [
            "diagnosis"
        ]
    },


    {
        id: "biomarker",
        name: "Biomarker",
        size: "small",
        definition: "A measurable indicator of a biological process or medical condition.",
        links: [
            "diagnosis",
            "alzheimers"
        ]
    },


    {
        id: "stroke",
        name: "Stroke",
        size: "small",
        definition: "A medical event caused by interrupted blood flow to part of the brain.",
        links: [
            "vascular-dementia"
        ]
    },


    {
        id: "neurodegeneration",
        name: "Neurodegeneration",
        size: "medium",
        definition: "The progressive loss or damage of neurons in the nervous system.",
        links: [
            "dementia",
            "lewy-body-dementia",
            "frontotemporal-dementia"
        ]
    }

];



function createGlossaryEntries() {

    const container = document.getElementById("glossary-content");

    if (!container) {
        return;
    }


    let currentLetter = "";


    glossaryTerms
        .sort((a,b) => a.name.localeCompare(b.name))
        .forEach(term => {


            const letter = term.name[0].toUpperCase();


            if (letter !== currentLetter) {

                currentLetter = letter;


                const heading = document.createElement("h3");

                heading.textContent = letter;

                heading.id = letter;


                container.appendChild(heading);

            }



            const article = document.createElement("article");

            article.className = "glossary-entry";

            article.id = term.id;



            const title = document.createElement("h4");

            title.textContent = term.name;



            const description = document.createElement("p");

            description.textContent = term.definition;



            const related = document.createElement("p");

            related.className = "related";

            related.innerHTML = "Related: ";



            term.links.forEach(link => {

                const linkedTerm =
                    glossaryTerms.find(
                        item => item.id === link
                    );


                if (linkedTerm) {

                    const anchor =
                        document.createElement("a");


                    anchor.href =
                        "#" + linkedTerm.id;


                    anchor.textContent =
                        linkedTerm.name;


                    related.appendChild(anchor);

                    related.appendChild(
                        document.createTextNode(" ")
                    );

                }

            });



            article.appendChild(title);

            article.appendChild(description);

            article.appendChild(related);


            container.appendChild(article);


        });

}



function createGlossaryGraph() {

    const svg =
        document.getElementById(
            "glossary-graph"
        );


    if (!svg) {
        return;
    }


    const centerX = 400;
    const centerY = 400;
    const radius = 260;


    const positions = {};



    glossaryTerms.forEach((term,index)=>{


        if(term.id === "dementia") {

            positions[term.id] = {
                x:centerX,
                y:centerY
            };

        }

        else {

            const angle =
                ((index - 1) /
                (glossaryTerms.length - 1))
                *
                Math.PI * 2;


            positions[term.id] = {

                x:
                centerX +
                Math.cos(angle) * radius,

                y:
                centerY +
                Math.sin(angle) * radius

            };

        }


    });



    glossaryTerms.forEach(term=>{


        term.links.forEach(link=>{


            if(
                positions[term.id] &&
                positions[link]
            ) {


                const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


                line.setAttribute(
                    "x1",
                    positions[term.id].x
                );


                line.setAttribute(
                    "y1",
                    positions[term.id].y
                );


                line.setAttribute(
                    "x2",
                    positions[link].x
                );


                line.setAttribute(
                    "y2",
                    positions[link].y
                );


                line.classList.add(
                    "graph-line"
                );


                svg.appendChild(line);

            }


        });


    });



    glossaryTerms.forEach(term=>{


        const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "a"
        );


        group.setAttribute(
            "href",
            "#" + term.id
        );



        const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


        let size = 30;


        if(term.size === "medium") {
            size = 38;
        }

        if(term.size === "large") {
            size = 48;
        }

        if(term.size === "largest") {
            size = 65;
        }



        circle.setAttribute(
            "cx",
            positions[term.id].x
        );


        circle.setAttribute(
            "cy",
            positions[term.id].y
        );


        circle.setAttribute(
            "r",
            size
        );


        circle.classList.add(
            "graph-node",
            term.size
        );



        group.appendChild(circle);



        const text =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


        text.setAttribute(
            "x",
            positions[term.id].x
        );


        text.setAttribute(
            "y",
            positions[term.id].y + size + 18
        );


        text.textContent =
            term.name;


        text.classList.add(
            "graph-text"
        );


        group.appendChild(text);


        svg.appendChild(group);


    });


}



function setupGlossarySearch() {


    const search =
    document.getElementById(
        "glossary-search"
    );


    if(!search) {
        return;
    }


    search.addEventListener(
        "input",
        ()=>{


            const value =
            search.value.toLowerCase();



            const match =
            glossaryTerms.find(
                term =>
                term.name
                .toLowerCase()
                .includes(value)
            );


            if(match && value.length > 1) {


                const element =
                document.getElementById(
                    match.id
                );


                element.scrollIntoView({
                    behavior:"smooth"
                });


                element.classList.add(
                    "highlight"
                );


                setTimeout(()=>{

                    element.classList.remove(
                        "highlight"
                    );

                },1500);


            }


        }
    );

}



document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        createGlossaryEntries();

        createGlossaryGraph();

        setupGlossarySearch();

    }
);