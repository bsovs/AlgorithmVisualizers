
var id = [];
var finMove = 0;

class Node {

  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = null;
	this.children = 0;
	this.childrenLeft = 0;
	this.childrenRight = 0;
	this.id = 0;
	this.x = screenSize().x-screenSize().x/3;
	this.y = 120;
  }

}

class BinaryTree {

  constructor() {
    this.root = null;
	this.size = 0;
	this.deleted = 0;
	this.radius = 30;
  }

  insert(data) {

    var newNode = new Node(data);
	
	this.size += 1;

    if (this.root === null) {
		document.getElementById('tree').innerHTML = '';
      this.root = newNode;
      this.root.color = "black";
	  this.root.children = 0;
	  this.root.id = 0;
	  this.addToSite(this.root);
    } 
	else{
      this.insertNode(this.root, newNode);  
	}

  }

  addToSite(node){
	  //document.getElementById('tree').innerHTML += '<div id='+node.id+'></div>';
  }

  insertNode(node, newNode) {
  
	node.children +=1;
	
    if (newNode.data < node.data) {
	  node.childrenLeft += 1;
      if (node.left === null) {
        node.left = newNode;
        node.left.parent = node;
        node.left.color = "red";
		node.left.id = this.root.children;
		this.addToSite(node.left);
      } else
        this.insertNode(node.left, newNode);
    } else {
	  node.childrenRight += 1;
      if (node.right === null) {
        node.right = newNode;
        node.right.parent = node;
        node.right.color = "red";
		node.right.id = this.root.children;
		this.addToSite(node.right);
      } else
        this.insertNode(node.right, newNode);
    }

  }

	deleteNode(key){
		if(this.root !== null){
			this.deleteNodeHelper(key, this.root);
			if(this.deleted >= this.size/2){
				//this.buildTree();
			}
		}
		t.printTree();
	}

	deleteNodeHelper(key, node){
		if(node === null){
			return "Not Found";
		}
		else if(node.data === key){
			//document.getElementById(node.id).innerHTML = '';
			if(node.right === null){
				this.deleted++;
				document.getElementById(node.id).remove();
				if(node.parent !== null){
					if(node.parent.right === node){
						this.updateChildren(node);
						if(node.left !== null){
							node.left.parent = node.parent;
						}
						node.parent.right = node.left;
						node.parent = null;
						node.left = null;
					}
					else if(node.parent.left === node){
						this.updateChildren(node);
						if(node.left !== null){
							node.left.parent = node.parent;
						}
						node.parent.left = node.left;
						node.parent = null;
						node.left = null;
					}
				}
				else{
					if(node.left !== null){
						node.left.parent = null;
					}
					this.root = node.left;
					if(this.root !== null)
						this.root.color = "black";
				}
			}
			else{
				var rep = this.minChild(node.right);
				if(rep.parent !== node)
					rep.parent.left = rep.right;
				rep.left = node.left;
				if(node.right !== rep)
					rep.right = node.right;
				rep.parent = node.parent;
				if(node.left !== null){
					node.left.parent = rep;
				}
				if(node.right !== rep){
					node.right.parent = rep;
				}
				node.left = null;
				node.right = null;
				if(node.parent !== null){
					if(node.parent.left === node)
						node.parent.left = rep;
					else
						node.parent.right = rep;
				}
				else{
					this.root = rep;
					this.root.left = rep.left;
					this.root.right = rep.right;
				}
				node.parent = null;
				document.getElementById(node.id).remove();
				rep.color = "black";
				//this.deleteNodeHelper(rep.data, rep);
			}
		}else{
			this.deleteNodeHelper(key, node.left);
			this.deleteNodeHelper(key, node.right);
		}
	}

	minChild(node){
		if(node.left !== null)
			return this.minChild(node.left);
		else
			return node;
	}
	
	updateChildren(node){
		if(node.parent !== null){
			node.parent.children--;
			if(node.parent.left === node){
				node.parent.childrenLeft--;
			}
			else{
				node.parent.childrenRight--;
			}
			this.updateChildren(node.parent);
		}
		
	}

	buildTree(){
		this.size = 0;
		this.deleted = 0;
		var arr = [];
		arr = this.array(this.root, arr);
	}
	
	array(node, arr){
		if(node.left !== null){
			this.array(node.left, arr);
		}
		arr.push(node.data);
		if(node.right !== null){
			this.array(node.right, arr);
		}
		return arr;
	}

	search(key){
		return this.searchHelp(this.root, key);
	}
	
	searchHelp(node, key){
		if(node === null){
			return "Not Found";
		}
		if(node.data == key){
			return node;
		}
		else if(node.data > key){
			return this.searchHelp(node.left, key);
		}
		else{
			return this.searchHelp(node.right, key);
		}
	}

	clearCanvas(){
		this.root = null;
		this.size = 0;
		document.getElementById('tree').innerHTML = '<div id="addNode"><h1>Add Nodes To Build Tree.</h1></div>';
		document.getElementById('branch').innerHTML = '';
		id = [];
		finMove = 0;
	}

	printTree(){
		
		document.getElementById('tree').style.left = '0px';
		document.getElementById('branch').style.left = '0px';
		document.getElementById('tree').style.width = '100%';
		document.getElementById('branch').style.width = '100%';
		
		
		document.getElementById('branch').innerHTML = '';
		id = [];
		finMove = 0;
		
		var elem = document.getElementsByClassName('btn');
		
		for(var i=0;i<elem.length;i++){
			elem[i].disabled = true;
		}
		
		if(this.root !== null){
			var x = screenSize().x/2;
			if(Math.abs(this.root.childrenLeft-this.root.childrenRight) > 3){
				x = screenSize().x/2+this.root.childrenLeft*30-this.root.childrenRight*30
			}
			
			var r = 30; //radius of circles
			if(this.root.children > 15){
				r = 20; //shrik radius
			}
			else if(this.root.children > 25){
				r = 10; //shrik radius
			}
			this.radius = r;
			
			if(this.root.left === null && this.root.right === null)
				this.root.x = screenSize().x/2;
			
			this.printTreeHelp(this.root, x, 130, screenSize().x/2, r);
			}
		else{
			document.getElementById('tree').innerHTML = '<div id="addNode"><h1>Add Nodes To Build Tree.</h1></div>';
		}

		setInterval(function (){if(finMove>=id.length){for(var i=0;i<elem.length;i++){
			elem[i].disabled = false;
		}}}, 10);
  }

	printTreeHelp(node, x, y, parx, r){
  	if(node === null) return;
	else{ 
		this.printNode(node, x, y, parx, r);
		if(node.left !== null)
			this.printTreeHelp(node.left, x-2*r-node.left.childrenRight*2*r, y+80, x, r);
		if(node.right !== null)
			this.printTreeHelp(node.right, x+2*r+node.right.childrenLeft*2*r, y+80, x, r);
	}
  }

  printNode(node, x, y, parx, r) {
	var borderColor = "black";
	var color = "#858585"

	if(document.getElementById(node.id) === null){
		document.getElementById('tree').innerHTML += '<div id='+node.id+' style="position:absolute;top:'+y+'px;left:'+x+'px;"><svg height="100" width="100"><circle id="'+node.id+'circ" cx="50" cy="50" r="'+r+'" stroke="'+borderColor+'" stroke-width="3" fill="'+color+'" /><text x="50%" y="52%" text-anchor="middle" stroke="#0000" style="fontSize:'+r+'px;" stroke-width="2px" dy="1" style="font-family: \'Candal\', sans-serif;">'+node.data+'</text></svg></div>';
		this.myMove(node,x,y,node.x,node.y);
		node.x = x;
		node.y = y;
	}
	else{
		this.myMove(node,x,y,node.x,node.y);
		node.x = x;
		node.y = y;
		//document.getElementById(node.id).style = 'position:absolute;top:'+y+'px;left:'+x+'px;';
		var elem = document.getElementById(node.id+'circ');
		elem.setAttribute('stroke',borderColor);
		elem.setAttribute('fill',color);
		elem.setAttribute('r',this.radius);
	}
	if(node !== this.root)
			document.getElementById('branch').innerHTML += '<svg style="z-index:-1;position:absolute;top:0;left:0;" height="100%" width="100%"><line x1="'+(x+50)+'" y1="'+(y+50)+'" x2="'+(parx+50)+'" y2="'+(y-80+50)+'" stroke="black"/></svg>';
	
	 /////////////////////////
 }

myMove(node,x,y, ox, oy) {
  var elem = document.getElementById(node.id);   
  var posX = ox;
  var posY = oy;
  var key = id.length;
  id.push(setInterval(move, 1));
  function move() {
	elem = document.getElementById(node.id);
    if (Math.abs(posX-x)>1) {
      if(posX<x)
		posX++; 
	 else posX--;
      elem.style.left = posX + "px"; 
    } 
	if(Math.abs(posY-y)>1) {
      if(posY<y)
		posY++; 
	  else posY--;
      elem.style.top = posY + "px"; 
    }
	if(Math.abs(posX-x)<=1 && Math.abs(posY-y)<=1){
		finMove++;
	  clearInterval(id[key]);
    }
  }
}

	pulse(node){
		var elem = document.getElementById(node.id+'circ');
		var radius = this.radius;
		var orgRadius = this.radius;
		var id = setInterval(shrink, 100);
		function shrink() {
			if (radius <= orgRadius-5) {
			  clearInterval(id);
			  id = setInterval(grow, 100);
			} 
			else{
			  radius--; 
			  elem = document.getElementById(node.id+'circ');
			  elem.setAttribute('r',radius);
			}
		}
		function grow() {
			if (radius >= orgRadius) {
			  clearInterval(id);
			} 
			else{
			  radius++; 
			  elem = document.getElementById(node.id+'circ');
			  elem.setAttribute('r',radius);
			}
		}
	}
	
	ring(value){
		var node = this.root;
		var next = null;
		var check = true;
		var width = 3;
		var elem = document.getElementById(node.id+'circ');
		var id = setInterval(func, 100);
		function func() {
			if(width >= 8){
				elem.setAttribute('stroke-width',3);
				clearInterval(id);
				node = next;
				check = true;
				width = 3;
				id = setInterval(func, 100);
			}
			else{
				elem = document.getElementById(node.id+'circ');
				elem.setAttribute('stroke-width',width);
				if(check === true){
					if (value < node.data) {
					  if (node.left === null) {
						 clearInterval(id);
					  } 
					  else{
						next = node.left;
					  }
					} 
					else {
					  if (node.right === null) {
						 clearInterval(id);
					  } 
					  else{
						next = node.right;
					  }
					}
					check = false;
				}
				width++;	
			}			
		}
	}
	
	shiftTree(){
		document.getElementById('tree').style.left = (-this.root.x+screenSize().x/2)+'px';
		document.getElementById('branch').style.left = (-this.root.x+screenSize().x/2)+'px';
		document.getElementById('tree').style.width = (this.root.x-screenSize().x/2)+screenSize().x+'px';
		document.getElementById('branch').style.width = (this.root.x-screenSize().x/2)+screenSize().x+'px';
	}

}

function screenSize(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	return {x: x,y: y};
}

