const glossaryTerms = [
    {id:"dementia",name:"Dementia",definition:"A general term describing conditions that affect memory, thinking, behavior, and the ability to perform daily activities.",x:600,y:420,radius:65,color:"#0E4C92",text:"#ffffff",links:["alzheimers","memory","diagnosis","cognition","neuron","neurodegeneration"]},
    {id:"alzheimers",name:"Alzheimer's Disease",definition:"The most common form of dementia, associated with changes in the brain that affect memory and cognition.",x:390,y:540,radius:45,color:"#2E6DA4",text:"#ffffff",links:["dementia","amyloid","tau","hippocampus"]},
    {id:"memory",name:"Memory",definition:"The ability of the brain to store, retain, and recall information.",x:400,y:340,radius:42,color:"#2E6DA4",text:"#ffffff",links:["dementia","hippocampus","neuron","cognition"]},
    {id:"diagnosis",name:"Diagnosis",definition:"The process of identifying a medical condition through evaluation, observation, and testing.",x:820,y:300,radius:40,color:"#2E6DA4",text:"#ffffff",links:["dementia","mri","biomarker"]},
    {id:"cognition",name:"Cognition",definition:"The mental processes involved in thinking, learning, reasoning, and understanding.",x:620,y:190,radius:38,color:"#5F8DBB",text:"#ffffff",links:["dementia","memory","frontotemporal"]},
    {id:"neuron",name:"Neuron",definition:"A specialized cell that communicates information throughout the nervous system.",x:820,y:580,radius:42,color:"#2E6DA4",text:"#ffffff",links:["dementia","synapse","neurotransmitter"]},
    {id:"neurodegeneration",name:"Neurodegeneration",definition:"The progressive loss or damage of neurons in the nervous system.",x:850,y:90,radius:36,color:"#5F8DBB",text:"#ffffff",links:["dementia","lewy","frontotemporal"]},
    {id:"hippocampus",name:"Hippocampus",definition:"A brain structure important for learning and forming new memories.",x:190,y:320,radius:28,color:"#A9C7E8",text:"#16324F",links:["memory","alzheimers"]},
    {id:"amyloid",name:"Amyloid Plaque",definition:"A buildup of abnormal protein fragments studied in relation to Alzheimer's disease.",x:190,y:620,radius:30,color:"#A9C7E8",text:"#16324F",links:["alzheimers","tau"]},
    {id:"tau",name:"Tau Protein",definition:"A protein involved in maintaining neuron structure that can form abnormal tangles in some diseases.",x:410,y:760,radius:30,color:"#A9C7E8",text:"#16324F",links:["alzheimers","amyloid"]},
    {id:"mri",name:"MRI",definition:"A medical imaging technique used to create detailed images of structures inside the body.",x:1040,y:200,radius:25,color:"#A9C7E8",text:"#16324F",links:["diagnosis"]},
    {id:"biomarker",name:"Biomarker",definition:"A measurable indicator of a biological process or medical condition.",x:1080,y:370,radius:28,color:"#A9C7E8",text:"#16324F",links:["diagnosis","alzheimers"]},
    {id:"synapse",name:"Synapse",definition:"The connection point where neurons communicate with other cells.",x:1050,y:650,radius:25,color:"#A9C7E8",text:"#16324F",links:["neuron","neurotransmitter"]},
    {id:"neurotransmitter",name:"Neurotransmitter",definition:"A chemical messenger that allows neurons to communicate with each other.",x:1120,y:800,radius:26,color:"#A9C7E8",text:"#16324F",links:["synapse","neuron"]},
    {id:"stroke",name:"Stroke",definition:"A medical event caused by interrupted blood flow to part of the brain.",x:980,y:780,radius:24,color:"#A9C7E8",text:"#16324F",links:["vascular"]},
    {id:"vascular",name:"Vascular Dementia",definition:"A form of dementia caused by damage related to problems with blood flow in the brain.",x:760,y:820,radius:32,color:"#5F8DBB",text:"#ffffff",links:["dementia","stroke"]},
    {id:"frontotemporal",name:"Frontotemporal Dementia",definition:"A group of disorders caused by degeneration of brain regions involved in personality, behavior, and language.",x:420,y:100,radius:34,color:"#5F8DBB",text:"#ffffff",links:["dementia","cognition","neurodegeneration"]},
    {id:"lewy",name:"Lewy Body Dementia",definition:"A type of dementia associated with abnormal deposits of alpha-synuclein protein in brain cells.",x:900,y:30,radius:32,color:"#5F8DBB",text:"#ffffff",links:["dementia","neurodegeneration"]}
];

const graph=document.getElementById("glossary-graph");

function getTerm(id){
    return glossaryTerms.find(term=>term.id===id);
}

function createConnection(a,b){
    const path=document.createElementNS("http://www.w3.org/2000/svg","path");
    const mx=(a.x+b.x)/2;
    const my=(a.y+b.y)/2;
    const dx=b.x-a.x;
    const dy=b.y-a.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    const offset=35;
    const cx=mx-(dy/distance)*offset;
    const cy=my+(dx/distance)*offset;

    path.setAttribute("d",`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`);
    path.classList.add("graph-line");
    path.dataset.from=a.id;
    path.dataset.to=b.id;

    graph.appendChild(path);
}

function createNode(term){
    const group=document.createElementNS("http://www.w3.org/2000/svg","g");
    group.classList.add("graph-group");
    group.dataset.id=term.id;

    const circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute("cx",term.x);
    circle.setAttribute("cy",term.y);
    circle.setAttribute("r",term.radius);
    circle.setAttribute("fill",term.color);
    circle.classList.add("graph-node");

    const text=document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x",term.x);
    text.setAttribute("y",term.y);
    text.setAttribute("fill",term.text);
    text.setAttribute("text-anchor","middle");
    text.setAttribute("dominant-baseline","middle");
    text.classList.add("graph-label");

    const words=term.name.split(" ");
    let line="";
    let lines=[];

    words.forEach(word=>{
        if((line+" "+word).length>12){
            lines.push(line);
            line=word;
        }else{
            line=(line+" "+word).trim();
        }
    });

    if(line) lines.push(line);

    lines.forEach((item,index)=>{
        const span=document.createElementNS("http://www.w3.org/2000/svg","tspan");
        span.textContent=item;
        span.setAttribute("x",term.x);
        span.setAttribute("dy",index===0?-(lines.length-1)*8:16);
        text.appendChild(span);
    });

    group.appendChild(circle);
    group.appendChild(text);

    group.addEventListener("click",()=>{
        window.location.hash=term.id;
        highlightTerm(term.id);
    });

    group.addEventListener("mouseenter",()=>{
        highlightConnections(term);
    });

    group.addEventListener("mouseleave",()=>{
        clearGraphHighlight();
    });

    graph.appendChild(group);
}

function drawGraph(){
    if(!graph)return;

    graph.setAttribute("viewBox","0 0 1200 900");

    glossaryTerms.forEach(term=>{
        term.links.forEach(link=>{
            const target=getTerm(link);
            if(target && term.id<target.id){
                createConnection(term,target);
            }
        });
    });

    glossaryTerms.forEach(createNode);
}
function createGlossaryEntries(){
    const container=document.getElementById("glossary-content");
    if(!container)return;

    let currentLetter="";

    glossaryTerms
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(term=>{
        const letter=term.name.charAt(0).toUpperCase();

        if(letter!==currentLetter){
            currentLetter=letter;

            const heading=document.createElement("h3");
            heading.textContent=letter;
            heading.id=letter;

            container.appendChild(heading);
        }

        const article=document.createElement("article");
        article.classList.add("glossary-entry");
        article.id=term.id;

        const title=document.createElement("h4");
        title.textContent=term.name;

        const description=document.createElement("p");
        description.textContent=term.definition;

        const related=document.createElement("p");
        related.classList.add("related");
        related.textContent="Related: ";

        term.links.forEach(link=>{
            const relatedTerm=getTerm(link);

            if(relatedTerm){
                const anchor=document.createElement("a");
                anchor.href="#"+relatedTerm.id;
                anchor.textContent=relatedTerm.name;

                related.appendChild(anchor);
                related.appendChild(document.createTextNode(" "));
            }
        });

        article.appendChild(title);
        article.appendChild(description);
        article.appendChild(related);

        container.appendChild(article);
    });
}


function highlightTerm(id){
    const element=document.getElementById(id);

    if(!element)return;

    element.classList.add("highlight");

    element.scrollIntoView({
        behavior:"smooth",
        block:"center"
    });

    setTimeout(()=>{
        element.classList.remove("highlight");
    },1500);
}


function setupHashNavigation(){
    if(window.location.hash){
        const id=window.location.hash.substring(1);

        setTimeout(()=>{
            highlightTerm(id);
        },500);
    }

    window.addEventListener("hashchange",()=>{
        const id=window.location.hash.substring(1);

        highlightTerm(id);
    });
}


function setupSearch(){
    const search=document.getElementById("glossary-search");

    if(!search)return;

    search.addEventListener("input",()=>{

        const value=search.value.toLowerCase().trim();

        if(value.length<2)return;

        const result=glossaryTerms.find(term=>
            term.name.toLowerCase().includes(value)
        );

        if(result){
            window.location.hash=result.id;
        }
    });
}


function setupAlphabet(){
    document.querySelectorAll(".alphabet a").forEach(link=>{

        link.addEventListener("click",event=>{

            event.preventDefault();

            const id=link.getAttribute("href").substring(1);

            const target=document.getElementById(id);

            if(target){
                target.scrollIntoView({
                    behavior:"smooth"
                });
            }

        });

    });
}


function highlightConnections(term){
    document.querySelectorAll(".graph-node,.graph-line").forEach(element=>{
        element.classList.add("fade");
    });

    const current=document.querySelector(
        `[data-id="${term.id}"] circle`
    );

    if(current){
        current.classList.remove("fade");
        current.classList.add("active");
    }

    term.links.forEach(link=>{

        const node=document.querySelector(
            `[data-id="${link}"] circle`
        );

        if(node){
            node.classList.remove("fade");
        }


        document.querySelectorAll(
            `.graph-line[data-from="${term.id}"][data-to="${link}"],
             .graph-line[data-from="${link}"][data-to="${term.id}"]`
        ).forEach(line=>{
            line.classList.remove("fade");
            line.classList.add("active");
        });

    });
}


function clearGraphHighlight(){
    document.querySelectorAll(".graph-node,.graph-line").forEach(element=>{
        element.classList.remove("fade");
        element.classList.remove("active");
    });
}


document.addEventListener("DOMContentLoaded",()=>{

    createGlossaryEntries();

    drawGraph();

    setupSearch();

    setupAlphabet();

    setupHashNavigation();

});