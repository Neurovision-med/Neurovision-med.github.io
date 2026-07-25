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

const CANVAS_SIZE = Vector.two(512, 512);

// physcis constants
const SPRING_RESTING_LENGTH = 200;
const SPRING_STIFFNESS = 0.03;
const REPULSION_STRENGTH = 3000;
const MAKE_GRABBED_NODE_IMMUNE_TO_SIMULATION = true;
// todo: maybe add a menu to change these in the thing (only if i feel very inspired to do that tho thats alot)

class Node {
    constructor(obj, data) {
        this.vel = Vector.two(0, 0)
        this.obj = obj;
        this.name = data.name;
        this.color = data.color ?? `rgba(${Math.floor(Math.random()*128)}, ${Math.floor(Math.random()*128)}, ${Math.floor(Math.random()*128)}, 1)`;
        this.link = data.link;
        this.connections = data.connections ?? [];
    }

    update() {
        this.obj.pos.addIp(this.vel);
        this.vel.sMulIp(0.6)
    }
}
const NODES = { // todo: move to more json like structure for initializing the nodes so phillip or some1 can more easily grunt work one of these out
    "test":  new Node(new Circle2D(Vector.two(200, 200), 30), { "link": "#test",  "name": "test", "connections": ["test2", "test3"]}),
    "test2": new Node(new Circle2D(Vector.two(300, 300), 30), { "link": "#test2", "name": "test2"}),
    "test3": new Node(new Circle2D(Vector.two(300, 200), 30), { "link": "#test3", "name": "test3", "connections": ["test2"]}),
    "test4": new Node(new Circle2D(Vector.two(200, 400), 30), { "link": "#test3", "name": "test3", "connections": ["test"]}),
}

class Engine {
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
            }
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
    
        if(node != null && !this.data.cursor.hasDragged) window.location.href = node.link;
    
        this.data.cursor.grabbedNode = null;
        this.data.cursor.hasDragged = false;
    }
    init() {
        this.setupHandlers();
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

                if(a != this.data.cursor.grabbedNode || !MAKE_GRABBED_NODE_IMMUNE_TO_SIMULATION) a.vel.addIp(forceVector);
                if(b != this.data.cursor.grabbedNode || !MAKE_GRABBED_NODE_IMMUNE_TO_SIMULATION) b.vel.subIp(forceVector);
            }
        }

        document.body.style.cursor = ""
        nodes.forEach(n => {
            n.connections.forEach(conn => {
                const connNode = NODES[conn];
                const pos1 = connNode.obj.pos;
                const pos2 = n.obj.pos;

                const delta = pos1.sub(pos2);
                const distance = pos1.dist(pos2);
                const stretch = distance - SPRING_RESTING_LENGTH;
                const force = stretch * SPRING_STIFFNESS;
                const dir = delta.normalize();
                const forceVector = dir.sMul(force);

                if(n != this.data.cursor.grabbedNode || !MAKE_GRABBED_NODE_IMMUNE_TO_SIMULATION) n.vel.addIp(forceVector);
                if(connNode != this.data.cursor.grabbedNode || !MAKE_GRABBED_NODE_IMMUNE_TO_SIMULATION) connNode.vel.subIp(forceVector);
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

        ctx.strokeStyle = "rgba(0, 0, 0, 1)"
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        Object.values(NODES).forEach(n => {
            if(n.connections != undefined) {
                n.connections.forEach(c => {
                    const connNode = NODES[c];
                    if(!connNode) return;
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
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

            ctx.font = "17px Arial"; // could scale w/ scale but looks better w/o
            ctx.fillStyle = "black";
            const textWidth = ctx.measureText(n.name).width;
            ctx.fillText(n.name, nx - textWidth / 2, ny - nr - 8);
        })
        
    }
}

const obj = document.getElementById("mindmap");
obj.width = CANVAS_SIZE.x;
obj.height = CANVAS_SIZE.y;
const engine = new Engine(obj.getContext("2d"));
engine.init();
window.requestAnimationFrame(engine.tick.bind(engine));