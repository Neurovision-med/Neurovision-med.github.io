const terms = {
    dementia:{
        name:"Dementia",
        definition:"A general term describing conditions that affect memory, thinking, behavior, and daily functioning."
    },
    alzheimers:{
        name:"Alzheimer's Disease",
        definition:"The most common form of dementia associated with changes in the brain affecting memory and cognition."
    },
    memory:{
        name:"Memory",
        definition:"The ability of the brain to store and recall information."
    },
    neuron:{
        name:"Neuron",
        definition:"A specialized cell that communicates information throughout the nervous system."
    },
    diagnosis:{
        name:"Diagnosis",
        definition:"The process of identifying a medical condition through evaluation and testing."
    },
    cognition:{
        name:"Cognition",
        definition:"The mental processes involved in thinking, learning, and understanding."
    },
    hippocampus:{
        name:"Hippocampus",
        definition:"A brain structure important for memory formation."
    },
    amyloid:{
        name:"Amyloid Plaque",
        definition:"A buildup of protein fragments associated with Alzheimer's disease research."
    },
    tau:{
        name:"Tau Protein",
        definition:"A protein that can form abnormal tangles in certain neurological diseases."
    },
    synapse:{
        name:"Synapse",
        definition:"The connection point where neurons communicate."
    },
    neurotransmitter:{
        name:"Neurotransmitter",
        definition:"A chemical messenger used by neurons."
    },
    mri:{
        name:"MRI",
        definition:"A medical imaging technique used to examine structures inside the body."
    },
    biomarker:{
        name:"Biomarker",
        definition:"A measurable indicator of a biological process or condition."
    },
    neurodegeneration:{
        name:"Neurodegeneration",
        definition:"The progressive loss of neurons in the nervous system."
    },
    frontotemporal:{
        name:"Frontotemporal Dementia",
        definition:"A dementia affecting regions involved in personality, behavior, and language."
    },
    lewy:{
        name:"Lewy Body Dementia",
        definition:"A dementia associated with abnormal protein deposits in brain cells."
    },
    vascular:{
        name:"Vascular Dementia",
        definition:"A dementia caused by damage related to problems with blood flow in the brain."
    },
    stroke:{
        name:"Stroke",
        definition:"A medical event caused by interrupted blood flow to part of the brain."
    }
};


function openTerm(id){

    window.location.hash=id;

    const element=document.getElementById(id);

    if(element){

        element.scrollIntoView({
            behavior:"smooth"
        });

    }

}


function setupGraph(){

    document.querySelectorAll(".graph-node").forEach(node=>{

        node.addEventListener("click",()=>{

            openTerm(node.dataset.term);

        });

    });

}


function generateGlossary(){

    const container=document.getElementById("glossary-content");

    if(!container)return;


    Object.keys(terms).forEach(id=>{

        const section=document.createElement("article");

        section.className="glossary-entry";

        section.id=id;


        section.innerHTML=`
            <h4>${terms[id].name}</h4>
            <p>${terms[id].definition}</p>
        `;


        container.appendChild(section);

    });

}


document.addEventListener("DOMContentLoaded",()=>{

    setupGraph();

    generateGlossary();

});