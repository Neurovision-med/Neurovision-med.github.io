/**
 * author thebadlorax
 * created on 24-07-2026-21h-21m
 * github: https://github.com/thebadlorax
 * copyright 2026
*/
// shoutout andrew morrison <3

/* things to think about:
 * - should the glossary be static html or kept in like a json file and
 * created at runtime
 * - phone support (n/a rn)
 * - how can we make the glossary more visually appealing past the mindmap
 *  - like when you go into the glossary after clicking something how to make not boring?
*/
import { Circle2D, Rect2D, Vector } from "./maths.js"; // copied my maths library from my other projects (i should add springs to it)

// when running this locally you have to swap out these to get data working right, just goofy ahh w/ the pages build
import data from "./glossary_data.json" with { type: "json" }
/*
let data = null; try {
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanUrl = new URL('glossary_data.json', baseUrl).href;
    const response = await fetch(cleanUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    data = await response.json();
} catch (error) { console.error("Could not load glossary data:", error); }
*/

const CANVAS_SIZE = Vector.two(data.mindmap.settings.canvas_size.w, data.mindmap.settings.canvas_size.h);

// physcis constants
let SPRING_RESTING_LENGTH = data.mindmap.settings.spring_resting_length;
const SPRING_STIFFNESS = data.mindmap.settings.spring_stiffness;
const REPULSION_STRENGTH = data.mindmap.settings.repulsion_strength;
let GRABBED_NODE_IMMUNE_TO_SIMULATION = data.mindmap.settings.grabbed_node_immune_to_simulation;

const container = document.getElementById("cards");

class Node {
    constructor(obj, data) {
        this.vel = Vector.two(0, 0)
        this.obj = obj;
        this.color = data.color ?? `rgba(${Math.floor(Math.random()*128)}, ${Math.floor(Math.random()*128)}, ${Math.floor(Math.random()*128)}, 1)`;
        this.link = data.link ?? data.name;
        this.name = data.name;
        this.connections = data.connections ?? [];
    }

    update() {
        this.obj.pos.addIp(this.vel);
        this.vel.sMulIp(0.6)
    }
}

const node_data = data.mindmap.nodes;
let NODES = {}
for (const [key, value] of Object.entries(node_data)) {
    let references = 0; for (const [key2, value2] of Object.entries(node_data)) {
        if(value.node_data.connections != undefined && value.node_data.connections.map(n1 => n1.id).includes(key2)) references += 1;
        if(value2.node_data.connections != undefined && value2.node_data.connections.map(n1 => n1.id).includes(key)) references += 1;
    }
    NODES[key] = new Node(new Circle2D(Vector.two(value.x, value.y), value.r+(data.mindmap.settings.connection_size_factor * references)), value.node_data)
}
const glossary_cards = data.glossary.cards
let glossary_card_map = {};

class Mindmap {
    constructor(ctx) {
        this.ctx = ctx;

        this.data = {
            "cursor": {
                "obj": new Rect2D(Vector.two(0, 0), 10, 10),
                "down": false,
                "last_pos": Vector.two(0, 0),
                "grabbedNode": null,
                "grabbedNodeStartPos": null,
                "hasDragged": false
            },
            "debug": false
        }
        this.scale = 1;
        this.offset = Vector.two(0, 0);
    }
    setupHandlers() {
        const canvas = this.ctx.canvas;
        window.addEventListener("mousemove", e => {
            const rect = canvas.getBoundingClientRect()
            this.data.cursor.last_pos.setIp(this.data.cursor.obj.pos);
            this.data.cursor.obj.pos.x = e.clientX - rect.left;
            this.data.cursor.obj.pos.y = e.clientY - rect.top;
        });
        window.addEventListener("keydown", e => {
            switch(e.key) {
                case data.mindmap.settings.debug_keybind: {
                    e.preventDefault()
                    this.data.debug = !this.data.debug;
                    break
                }
                case " ": {
                    if(!this.data.debug) break;
                    e.preventDefault()
                    GRABBED_NODE_IMMUNE_TO_SIMULATION = !GRABBED_NODE_IMMUNE_TO_SIMULATION
                    break
                }
                case "ArrowUp": {
                    if(!this.data.debug) break;
                    e.preventDefault();
                    SPRING_RESTING_LENGTH += 20
                    break;
                }
                case "ArrowDown": {
                    if(!this.data.debug) break;
                    e.preventDefault();
                    SPRING_RESTING_LENGTH -= 20
                    break;
                }
            }
        });
        canvas.addEventListener("mousedown", e => { this.data.cursor.down = true; this.onClick(); })
        window.addEventListener("mouseup", e =>   { this.data.cursor.down = false; this.onRelease(); })
        canvas.addEventListener("wheel", e => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
        
            const mouse = Vector.two(e.clientX - rect.left, e.clientY - rect.top);
            const oldScale = this.scale;
            if (e.deltaY < 0) this.scale *= 1.1;
            else this.scale *= 0.9;
        
            this.scale = Math.max(0.1, Math.min(this.scale, 5));
        
            this.offset.x = mouse.x - (mouse.x - this.offset.x) * (this.scale / oldScale);
            this.offset.y = mouse.y - (mouse.y - this.offset.y) * (this.scale / oldScale);
        });
    }

    onClick() {
        Object.values(NODES).forEach(n => {
            const screenPosCircle = new Circle2D(Vector.two(n.obj.pos.x * this.scale + this.offset.x,
                n.obj.pos.y * this.scale + this.offset.y), n.obj.r * this.scale);
            if(screenPosCircle.collides(this.data.cursor.obj)) {
                this.data.cursor.grabbedNode = n;
                this.data.cursor.grabbedNodeStartPos = n.obj.pos.copy();
                this.data.cursor.hasDragged = false;
            }
        })
    }
    onRelease() {
        const node = this.data.cursor.grabbedNode;
    
        if(node != null && !this.data.cursor.hasDragged) {
            const element = glossary_card_map[node.link];
            element.classList.add("selected")
            setTimeout(() => {
                element.classList.remove("selected")
            }, 500)
            const top = element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
            container.scrollTo({
                top: top - (container.clientHeight - element.clientHeight) / 2,
                behavior: "smooth",
            });
            updateCards()
        }
    
        this.data.cursor.grabbedNode = null;
        this.data.cursor.hasDragged = false;
    }
    init() {
        this.setupHandlers();
        this.fps_data = [];
    }
    tick(elapsed) {
        if(this._previousElapsed === null) {
            this._previousElapsed = elapsed;
            window.requestAnimationFrame(this.tick.bind(this));
            return;
        }
    
        const delta = Math.min(
            (elapsed - this._previousElapsed) / 1000,
            0.12
        );
    
        this._previousElapsed = elapsed;
        if(this.fps_data.length == 5) this.fps_data.shift();
        this.fps_data.push(delta || 0);
    
        this.update(delta);
        this.render();
    
        window.requestAnimationFrame(this.tick.bind(this));
    }
    update(delta) { // todo: scale physics w/ delta
        if(this.data.cursor.down) {
            if(this.data.cursor.grabbedNode == null) {
                this.offset.subIp(this.data.cursor.obj.pos.sub(this.data.cursor.last_pos).invert());
                this.data.cursor.last_pos.setIp(this.data.cursor.obj.pos);
            } else {
                if (this.data.cursor.obj.pos.dist(this.data.cursor.last_pos) > 2) {
                    this.data.cursor.hasDragged = true;
                }
                const movement = this.data.cursor.obj.pos.sub(this.data.cursor.last_pos).sMul(1 / this.scale);
                this.data.cursor.grabbedNode.obj.pos.addIp(movement);
                this.data.cursor.last_pos.setIp(this.data.cursor.obj.pos);
            }
        }

        const nodes = Object.values(NODES);

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i]; const b = nodes[j];

                const delta = a.obj.pos.sub(b.obj.pos);
                const distance = Math.max(a.obj.pos.dist(b.obj.pos), 1);
                const force = REPULSION_STRENGTH / (distance * distance);
                const dir = delta.normalize();
                const forceVector = dir.sMul(force);

                if(a != this.data.cursor.grabbedNode || !GRABBED_NODE_IMMUNE_TO_SIMULATION) a.vel.addIp(forceVector);
                if(b != this.data.cursor.grabbedNode || !GRABBED_NODE_IMMUNE_TO_SIMULATION) b.vel.subIp(forceVector);
            }
        }

        document.body.style.cursor = ""
        nodes.forEach(n => {
            n.connections.forEach(conn => {
                const connNode = NODES[conn.id];
                const pos1 = connNode.obj.pos;
                const pos2 = n.obj.pos;

                const delta = pos1.sub(pos2);
                const distance = pos1.dist(pos2);
                const stretch = distance - (conn.length ?? SPRING_RESTING_LENGTH);
                const force = stretch * SPRING_STIFFNESS;
                const dir = delta.normalize();
                const forceVector = dir.sMul(force);

                if(n != this.data.cursor.grabbedNode || !GRABBED_NODE_IMMUNE_TO_SIMULATION) n.vel.addIp(forceVector);
                if(connNode != this.data.cursor.grabbedNode || !GRABBED_NODE_IMMUNE_TO_SIMULATION) connNode.vel.subIp(forceVector);
            })
            n.update();

            if(!this.data.cursor.down) {
                const screenPosCircle = new Circle2D(Vector.two(n.obj.pos.x * this.scale + this.offset.x,
                    n.obj.pos.y * this.scale + this.offset.y), n.obj.r * this.scale);
                if(screenPosCircle.collides(this.data.cursor.obj)) {
                    document.body.style.cursor = "alias"
                }
            }
        })
        if(this.data.cursor.down) {
            if(this.data.cursor.hasDragged) document.body.style.cursor = "move";
            else if(this.data.cursor.grabbedNode != null) document.body.style.cursor = "alias" // technically doesn't do anything but if i wanna chane it later its good it's here
            else document.body.style.cursor = "grabbing"
        }
    }
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if(data.mindmap.settings.background.enabled) {
            ctx.fillStyle = data.mindmap.settings.background.color
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        if(data.mindmap.settings.outline) {
            ctx.strokeStyle = "rgba(0, 0, 0, 1)"
            ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }

        Object.values(NODES).forEach(n => {
            if(n.connections != undefined) {
                n.connections.forEach(c => {
                    const connNode = NODES[c.id];
                    if(!connNode) return;
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
                    ctx.beginPath();
                    ctx.moveTo(connNode.obj.pos.x * this.scale + this.offset.x, connNode.obj.pos.y * this.scale + this.offset.y);
                    ctx.lineTo(n.obj.pos.x * this.scale + this.offset.x, n.obj.pos.y * this.scale + this.offset.y)
                    ctx.stroke()
                })
            }
        })

        Object.values(NODES).forEach(n => {
            const nx = n.obj.pos.x * this.scale + this.offset.x;
            const ny = n.obj.pos.y * this.scale + this.offset.y
            const nr = n.obj.r*this.scale;
            ctx.beginPath();
            ctx.fillStyle = n.color;
            ctx.arc(nx, ny, nr, 0, 2 * Math.PI);
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.font = "17px Arial"; // could scale w/ scale but looks better w/o
            ctx.fillStyle = "black";
            const textWidth = ctx.measureText(n.name).width;
            ctx.fillText(n.name, nx - textWidth / 2, ny - nr - 8);
        })
        
        if(this.data.debug) {
            let avg = 0;
            this.fps_data.forEach(f => {
                avg += f;
            });
            avg /= this.fps_data.length;

            ctx.font = "17px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(`${(1/avg).toFixed(2)} FPS`, 10, 30);
            ctx.font = "14px Arial";
            ctx.fillText(`grabbed immune to sim: ${GRABBED_NODE_IMMUNE_TO_SIMULATION}`, 10, 50);
            ctx.fillText(`spring resting length: ${SPRING_RESTING_LENGTH} (change w/ arrow up & down)`, 10, 70);
        }
    }
}

const obj = document.getElementById("mindmap");
obj.width = CANVAS_SIZE.x;
obj.height = CANVAS_SIZE.y;
const mm = new Mindmap(obj.getContext("2d"));
mm.init();
window.requestAnimationFrame(mm.tick.bind(mm));

// info card stuff
const updateCards = () => {
    const center = container.getBoundingClientRect().top +container.clientHeight / 2;
    for (const card of container.children) {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;

        const distance = Math.abs(cardCenter - center);
        const half = container.clientHeight / 2;
        const fadeStart = half * 0.5;
        let t = (distance - fadeStart) / (half - fadeStart); t = Math.max(0, Math.min(t, 1));
        const minScale = 0.80; const scale = minScale + (1 - minScale) * Math.cos(t * Math.PI / 2);

        card.style.scale = `${scale}`;
        card.style.opacity = scale;
    }
}

// <div class="glossary-card" id="card-">1</div>
const spawnCard = (data) => {
    const ele = document.createElement("div");
    ele.classList.add("glossary-card");
    glossary_card_map[data.id] = ele;
    const header = document.createElement("h3");
    header.textContent = data.header;
    const description = document.createElement("p");
    description.textContent = data.description
    ele.appendChild(header);
    ele.appendChild(description)
    container.appendChild(ele);
}
const propogateCards = () => {
    glossary_cards.forEach(c => { spawnCard(c); })
    // <div class="glossary-card">padding card</div>
    const padding_card = document.createElement("div")
    padding_card.classList.add("spacer");
    padding_card.style.height = "200px"
    container.appendChild(padding_card);
}

container.addEventListener("scroll", e => { updateCards() });
window.addEventListener("resize", () => { updateCards() });
propogateCards();
updateCards();