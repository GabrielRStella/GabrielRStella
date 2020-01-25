var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
var material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry1, material1 );
scene.add( cube );

var geometry2 = new THREE.Geometry();
var material2 = new THREE.LineBasicMaterial({ color: 0x0000ff });
geometry2.vertices.push(new THREE.Vector3(-2, 0, 0));
geometry2.vertices.push(new THREE.Vector3(0, 2, 0));
geometry2.vertices.push(new THREE.Vector3(2, 0, 0));
var line = new THREE.Line(geometry2, material2);
scene.add(line);


function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0.04;
	cube.rotation.y += 0.04;
	renderer.render( scene, camera );
}
animate();