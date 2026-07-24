const glossaryTerms=[
    {id:"dementia",name:"Dementia",definition:"A general term describing conditions that affect memory, thinking, behavior, and the ability to perform daily activities.",x:500,y:400,r:65,color:"#0E4C92",text:"#ffffff",links:["memory","alzheimers","diagnosis","cognition","neuron"]},

    {id:"memory",name:"Memory",definition:"The ability of the brain to store, retain, and recall information.",x:500,y:190,r:42,color:"#2E6DA4",text:"#ffffff",links:["dementia","hippocampus","cognition"]},

    {id:"alzheimers",name:"Alzheimer's Disease",definition:"The most common form of dementia, associated with changes in the brain that affect memory and cognition.",x:300,y:280,r:45,color:"#2E6DA4",text:"#ffffff",links:["dementia","amyloid","tau","hippocampus"]},

    {id:"diagnosis",name:"Diagnosis",definition:"The process of identifying a medical condition through evaluation, observation, and testing.",x:700,y:280,r:40,color:"#2E6DA4",text:"#ffffff",links:["dementia","mri","biomarker"]},

    {id:"cognition",name:"Cognition",definition:"The mental processes involved in thinking, learning, reasoning, and understanding.",x:300,y:520,r:40,color:"#2E6DA4",text:"#ffffff",links:["dementia","memory","frontotemporal"]},

    {id:"neuron",name:"Neuron",definition:"A specialized cell that communicates information throughout the nervous system.",x:700,y:520,r:40,color:"#2E6DA4",text:"#ffffff",links:["dementia","synapse","neurotransmitter"]},

    {id:"hippocampus",name:"Hippocampus",definition:"A brain structure involved in forming and retrieving memories.",x:150,y:150,r:30,color:"#A9C7E8",text:"#16324F",links:["memory","alzheimers"]},

    {id:"amyloid",name:"Amyloid Plaque",definition:"A buildup of protein fragments associated with Alzheimer's disease research.",x:150,y:380,r:30,color:"#A9C7E8",text:"#16324F",links:["alzheimers","tau"]},

    {id:"tau",name:"Tau Protein",definition:"A protein involved in maintaining neuron structure that can form abnormal tangles.",x:220,y:650,r:30,color:"#A9C7E8",text:"#16324F",links:["alzheimers","amyloid"]},

    {id:"mri",name:"MRI",definition:"A medical imaging technique used to create detailed images of structures inside the body.",x:850,y:150,r:28,color:"#A9C7E8",text:"#16324F",links:["diagnosis"]},

    {id:"biomarker",name:"Biomarker",definition:"A measurable indicator of a biological process or condition.",x:850,y:380,r:30,color:"#A9C7E8",text:"#16324F",links:["diagnosis"]},

    {id:"synapse",name:"Synapse",definition:"The connection point where neurons communicate with other cells.",x:850,y:650,r:28,color:"#A9C7E8",text:"#16324F",links:["neuron"]},

    {id:"neurotransmitter",name:"Neurotransmitter",definition:"A chemical messenger that allows neurons to communicate.",x:700,y:760,r:28,color:"#A9C7E8",text:"#16324F",links:["neuron","synapse"]},

    {id:"frontotemporal",name:"Frontotemporal Dementia",definition:"A dementia affecting areas of the brain involved in personality, behavior, and language.",x:400,y:60,r:32,color:"#5F8DBB",text:"#ffffff",links:["cognition"]},

    {id:"lewy",name:"Lewy Body Dementia",definition:"A dementia associated with abnormal protein deposits in brain cells.",x:950,y:520,r:32,color:"#5F8DBB",text:"#ffffff",links:["dementia"]},

    {id:"vascular",name:"Vascular Dementia",definition:"A dementia caused by damage related to reduced blood flow in the brain.",x:500,y:760,r:32,color:"#5F8DBB",text:"#ffffff",links:["dementia"]},

    {id:"stroke",name:"Stroke",definition:"A medical event caused by interrupted blood flow to part of the brain.",x:950,y:760,r:25,color:"#A9C7E8",text:"#16324F",links:["vascular"]}
];


function getTerm(id){
    return glossaryTerms.find(term=>term.id===id);
}


function drawConnections(svg){

    glossaryTerms.forEach(term=>{

        term.links.forEach(link=>{

            const target=getTerm(link);

            if(target && term.id < target.id){

                const line=document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

                line.setAttribute("x1",term.x);
                line.setAttribute("y1",term.y);
                line.setAttribute("x2",target.x);
                line.setAttribute("y2",target.y);

                line.classList.add("graph-line");

                svg.appendChild(line);
            }
        });
    });
}


function drawNodes(svg){

    glossaryTerms.forEach(term=>{

        const group=document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        group.classList.add("graph-group");


        const circle=document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx",term.x);
        circle.setAttribute("cy",term.y);
        circle.setAttribute("r",term.r);
        circle.setAttribute("fill",term.color);

        circle.classList.add("graph-node");


        const text=document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x",term.x);
        text.setAttribute("y",term.y);
        text.setAttribute("fill",term.text);
        text.classList.add("graph-label");

        text.textContent=term.name;


        group.appendChild(circle);
        group.appendChild(text);


        group.addEventListener("click",()=>{

            window.location.hash=term.id;

            document
            .getElementById(term.id)
            ?.scrollIntoView({
                behavior:"smooth"
            });

        });


        svg.appendChild(group);

    });
}


function createMap(){

    const svg=document.getElementById("glossary-map");

    if(!svg)return;

    drawConnections(svg);
    drawNodes(svg);
}


function createGlossary(){

    const container=document.getElementById("glossary-content");

    if(!container)return;


    glossaryTerms.forEach(term=>{

        const article=document.createElement("article");

        article.className="glossary-entry";
        article.id=term.id;


        article.innerHTML=`
            <h3>${term.name}</h3>
            <p>${term.definition}</p>
        `;


        container.appendChild(article);

    });
}


function setupSearch(){

    const search=document.getElementById("glossary-search");

    if(!search)return;


    search.addEventListener("input",()=>{

        const value=search.value.toLowerCase();


        const result=glossaryTerms.find(term=>
            term.name.toLowerCase().includes(value)
        );


        if(result && value.length>1){

            window.location.hash=result.id;

            document
            .getElementById(result.id)
            ?.scrollIntoView({
                behavior:"smooth"
            });
        }

    });
}


document.addEventListener("DOMContentLoaded",()=>{

    createMap();

    createGlossary();

    setupSearch();

});