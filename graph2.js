import * as THREE from './3D/build/three.module.js';

import Stats from './3D/examples/jsm/libs/stats.module.js';
import { GUI } from './3D/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from './3D/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from './3D/examples/jsm/renderers/CSS2DRenderer.js';

var canvas = document.querySelector('#scene2');
var width = window.innerWidth;
var height = window.innerHeight;

// renderer
var renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true  } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.domElement.style.opacity = 0.6;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(3, 3, 90);

var controls = new OrbitControls( camera, renderer.domElement );

var geometry = new THREE.SphereGeometry(30, 4, 30);
var geometry = new THREE.BoxGeometry(49, 49, 49, 7, 7, 7);
for(var i=0;i<geometry.faces.length;i++){
    var face = geometry.faces[i];
    var vector = geometry.vertices[face.c];
    var v1 = geometry.vertices[face.a];
    var v2 = geometry.vertices[face.b];
    var v3 = geometry.vertices[face.c];

    var center = new THREE.Vector3();
    center.add(v1).add(v2).add(v3).divideScalar(3);

    face.materialIndex = Math.floor(center.y + 25) % 14 < 7 ? 0 : 1;
    if (center.y === 24.5) {
        face.materialIndex = 0;
    }
    if (face.materialIndex === 0) {
        face.materialIndex = Math.floor(center.x + 25) % 14 < 7 ? 0 : 1;
        if (center.x === 24.5) {
            face.materialIndex = 0;
        }
    }
}
for(var i=0;i<geometry.vertices.length;i++){
    var vector = geometry.vertices[i];
    vector._o = new THREE.Vector3().copy(vector);
}

var material = [
new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    transparent: true,
    opacity:0
}),
new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide,
    wireframe: true
})];

//0x179c6d
  var size = 100;
  var faceIndices = [ 'a', 'b', 'c', 'd' ];
  var face;
  // first, assign colors to vertices as desired
for ( var i = 0; i < geometry.vertices.length; i++ ) 
{
    var point = geometry.vertices[ i ];
    var color = new THREE.Color( 0x179c6d );
    color.setRGB( 0.1 + point.x / (size), 0.6 + point.y / (size), 0.6 + point.z / (size) );
    geometry.colors[i] = color; // use this array for convenience
}
  for ( var i = 0; i < geometry.faces.length; i++ ) 
{
     face = geometry.faces[ i ];
    var numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    for( var j = 0; j < numberOfSides; j++ ) 
    {
        var vertexIndex = face[ faceIndices[ j ] ];
        face.vertexColors[ j ] = geometry.colors[ vertexIndex ];
    }
}
geometry.colorsNeedUpdate = true;
geometry.verticesNeedUpdate = true;
geometry.dynamic = true;

var sphere = new THREE.Mesh( geometry, material );
sphere.geometry.verticesNeedUpdate = true;
sphere.geometry.dynamic = true;

TweenMax.to(sphere.rotation, 80, {
    y:Math.PI * 2,
    x: Math.PI * 2,
    ease:Power0.easeNone,
    repeat:-1
});
scene.add( sphere );

function render(a) {
    requestAnimationFrame(render);
    for(var i = 0; i < geometry.vertices.length; i++){
        var vector = geometry.vertices[i];
        var ratio = noise.simplex3((vector._o.x*0.01), (vector._o.y*0.01)+(a*0.0005), (vector._o.z*0.01));
        vector.copy(vector._o);
        vector.multiplyScalar(1 + (ratio*0.1));
        vector.multiplyScalar(1);
    }
    geometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
	geometry.colorsNeedUpdate = true;
	sphere.geometry.colorsNeedUpdate = true;
	//console.log(sphere.geometry.colors[10]);
	sphere.needsUpdate = true;
	material.needsUpdate = true;
}

controls.enablePan = false;
controls.enableZoom = false;
controls.update();

var projector, mouse = {
    x: 0,
    y: 0
  },
  INTERSECTED;
  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
// when the mouse moves, call the given function
document.addEventListener('mousemove', onDocumentMouseMove, false);



function animate() {

	update();
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );

}

function onDocumentMouseMove(event) {
  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function update() {
  // find intersections

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  vector.unproject(camera);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects(scene.children);

  // INTERSECTED = the object in the scene currently closest to the camera 
  //		and intersected by the Ray projected from the mouse position 	

  // if there is one (or more) intersections
  if (intersects.length > 0) {
	  
	  
	  for ( var i = 0; i < geometry.vertices.length; i++ ) 
		{
			var point = geometry.vertices[ i ];
			var color = new THREE.Color( 0x17b3a8 );
			color.setRGB(  Math.abs(mouse.x)*50, Math.abs(mouse.y)*50, Math.abs(mouse.y)*50);
			geometry.colors[i] = color; // use this array for convenience
			//console.log(geometry.vertexColors);
			if(Math.abs(geometry.vertices[i].x/window.innerWidth-mouse.x) < 50/window.innerWidth && Math.abs(geometry.vertices[i].y/window.innerHeight-mouse.y) < 50/window.innerHeight){
				geometry.colors[i].setHex(0xa817b3);
				//console.log(Math.abs(geometry.vertices[j].y/window.innerHeight-mouse.y) + '  '+ 50/window.innerHeight);
			}
		}
		/*
		  for ( var i = 0; i < geometry.faces.length; i++ ) 
		{
			 face = geometry.faces[ i ];
			var numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
			for( var j = 0; j < numberOfSides; j++ ) 
			{
				if(Math.abs(geometry.vertices[j].x/window.innerWidth-mouse.x) < 50/window.innerWidth && Math.abs(geometry.vertices[j].y/window.innerHeight-mouse.y) < 50/window.innerHeight)
					face.vertexColors[j].setHex(0xa817b3);
				else{
					face.vertexColors[j].setHex(0x17b3a8);
				}
			}
		}*/
		//console.log(Math.abs(geometry.vertices[j].y/window.innerHeight-mouse.y) + '  '+ 50/window.innerHeight);
	  
    // if the closest object intersected is not the currently stored intersection object
    if (intersects[0].object != INTERSECTED) {
      // restore previous intersection object (if it exists) to its original color
      if (INTERSECTED)
        INTERSECTED.object.material[1].color.setHex(INTERSECTED.currentHex);
      // store reference to closest object as current intersection object
      INTERSECTED = intersects[0].object;
      // store color of closest object (for later restoration)
      INTERSECTED.currentHex = INTERSECTED.material[1].color.getHex();
      // set a new color for closest object
		
		
    }
  } else // there are no intersections
  {
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED)
      INTERSECTED.material[1].color.setHex(INTERSECTED.currentHex);
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
    INTERSECTED = null;
  }
  
	geometry.colorsNeedUpdate = true;
	sphere.geometry.colorsNeedUpdate = true;
	//console.log(sphere.geometry.colors[10]);
	sphere.needsUpdate = true;
	material.needsUpdate = true;

  controls.update();
  stats.update();
}

function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();  
    renderer.setSize(width, height);
}

requestAnimationFrame(render);
var resizeTm;
window.addEventListener("resize", function(){
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});

animate();
