

	
	//collide with a particle at a given (world coords) point
	//tests for collision (overlap) with each of its own constituent particles, then updates force/torque on self (not on other body)
	collide(p, b) {
		for(var i = 0; i < this.particles.length; i++) {
			var selfp = this.getParticlePosition(i);
			//
			var offset = p.copy();
			offset.sub(selfp);
			//
			var dist = offset.magnitude;
			var overlap = Math.max(0, 2 - dist);
			if(overlap > 0) {
				//collision
				//midpoint (approx. collision point)
				var mp = p.copy();
				mp.add(selfp);
				mp.multiply(0.5);
				//"line of centers"
				var N = offset.copy();
				N.magnitude = 1;
				//
				var v1 = this.getVelocityAt(mp);
				var v2 = b.getVelocityAt(mp);
				//relative velocity at point of contact
				var V = v1.copy();
				V.sub(v2);
				//change in overlap (normal velocity)
				var doverlap = V.x * N.x + V.y * N.y;
				//tangent velocity
				var Vt = V.copy();
				var tmp = N.copy();
				tmp.multiply(doverlap);
				Vt.sub(tmp);
				//force parameters
				var kd = 1;
				var kr = 0.85;
				var alpha = 0.5;
				var beta = 1.5;
				var u = 0.1;
				//normal force
				var fn = -(kd * Math.pow(overlap, alpha) * doverlap + kr * Math.pow(overlap, beta));
				var Fn = N.copy();
				Fn.multiply(fn);
				//
				var off = mp.copy();
				off.sub(this.position);
				this.applyForce(off, Fn);
				//tangent force (shear friction)
				var Ft = Vt.copy();
				if(!Ft.zero) {
					Ft.magnitude = -u * fn;
					this.applyForce(off, Ft);
				}
			}
		}
	}
	

}