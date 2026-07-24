const glossaryNodes=[
    {id:"dementia",name:"Dementia",size:65,ring:0,color:"#0E4C92",links:["memory","alzheimers","diagnosis","cognition","neuron"]},

    {id:"memory",name:"Memory",size:42,ring:1,color:"#2E6DA4",links:["dementia","hippocampus","neuron"]},
    {id:"alzheimers",name:"Alzheimer's",size:45,ring:1,color:"#2E6DA4",links:["dementia","amyloid","tau"]},
    {id:"diagnosis",name:"Diagnosis",size:38,ring:1,color:"#2E6DA4",links:["dementia","mri","biomarker"]},
    {id:"cognition",name:"Cognition",size:38,ring:1,color:"#2E6DA4",links:["dementia","memory","frontotemporal"]},
    {id:"neuron",name:"Neuron",size:40,ring:1,color:"#2E6DA4",links:["dementia","synapse"]},

    {id:"hippocampus",name:"Hippocampus",size:28,ring:2,color:"#A9C7E8",links:["memory"]},
    {id:"amyloid",name:"Amyloid",size:28,ring:2,color:"#A9C7E8",links:["alzheimers"]},
    {id:"tau",name:"Tau",size:28,ring:2,color:"#A9C7E8",links:["alzheimers"]},
    {id:"mri",name:"MRI",size:25,ring:2,color:"#A9C7E8",links:["diagnosis"]},
    {id:"biomarker",name:"Biomarker",size:28,ring:2,color:"#A9C7E8",links:["diagnosis"]},
    {id:"synapse",name:"Synapse",size:25,ring:2,color:"#A9C7E8",links:["neuron"]},
    {id:"frontotemporal",name:"Frontotemporal",size:30,ring:2,color:"#5F8DBB",links:["cognition"]},
    {id:"lewy",name:"Lewy Body",size:30,ring:2,color:"#5F8DBB",links:["dementia"]},
    {id:"vascular",name:"Vascular",size:30,ring:2,color:"#5F8DBB",links:["dementia"]}
];


function positionNodes(){

    const centerX=600;
    const centerY=450;

    const rings={
        0:[],
        1:[],
        2:[]
    };

    glossaryNodes.forEach(node=>{
        rings[node.ring].push(node);
    });


    Object.keys(rings).forEach(ring=>{

        const nodes=rings[ring];

        if(ring==0){

            nodes[0].x=centerX;
            nodes[0].y=centerY;

        }

        else{

            const radius=ring==1?190:340;

            nodes.forEach((node,index)=>{

                const angle=
                    (Math.PI*2/nodes.length)*index
                    -Math.PI/2;


                node.x=centerX+
                    Math.cos(angle)*radius;


                node.y=centerY+
                    Math.sin(angle)*radius;

            });

        }

    });

}


function createGraph(){

    const svg=document.getElementById("glossary-graph");

    if(!svg)return;


    positionNodes();

    svg.innerHTML="";


    svg.setAttribute(
        "viewBox",
        "0 0 1200 900"
    );


    glossaryNodes.forEach(node=>{

        node.links.forEach(link=>{

            const target=
                glossaryNodes.find(
                    n=>n.id==link
                );


            if(target && node.id<target.id){

                const line=
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


                line.setAttribute("x1",node.x);
                line.setAttribute("y1",node.y);
                line.setAttribute("x2",target.x);
                line.setAttribute("y2",target.y);

                line.classList.add("graph-line");

                svg.appendChild(line);

            }

        });

    });


    glossaryNodes.forEach(node=>{

        const group=
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


        const circle=
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


        circle.setAttribute("cx",node.x);
        circle.setAttribute("cy",node.y);
        circle.setAttribute("r",node.size);
        circle.setAttribute("fill",node.color);

        circle.classList.add("graph-node");


        const text=
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


        text.setAttribute("x",node.x);
        text.setAttribute("y",node.y);

        text.setAttribute(
            "text-anchor",
            "middle"
        );

        text.setAttribute(
            "dominant-baseline",
            "middle"
        );

        text.textContent=node.name;

        text.classList.add("graph-label");


        group.appendChild(circle);
        group.appendChild(text);


        group.onclick=()=>{

            location.hash=node.id;

        };


        svg.appendChild(group);

    });

}


document.addEventListener(
"DOMContentLoaded",
()=>{

    createGraph();

});