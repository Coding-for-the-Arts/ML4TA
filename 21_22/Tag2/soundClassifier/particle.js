class Particle {
    constructor() {
      this.pos = createVector(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
      this.direction = createVector(Math.random() * 0.7, Math.random() * 0.7);
    }
  
    //Moves the particles and bounces them off the edges
    move() {
      this.pos = this.pos.add(this.direction);
  
      if (this.pos.x <= 0) this.direction.x *= -1;
      if (this.pos.x > width) this.direction.x *= -1;
      if (this.pos.y <= 0) this.direction.y *= -1;
      if (this.pos.y > height) this.direction.y *= -1;
    }
  
    //Connects particles with a line, if they're close enough
    connect() {
      particles.forEach(particle => {
        let distance = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
        if (distance < lineMaxDist) {
          stroke(color(random(255), random(255), random(255), map(distance, 0, lineMaxDist, 255, 0)));
          strokeWeight(map(distance, 0, lineMaxDist, 5, 2));
          line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
        }
      })
    }
  
    display() {
      noFill()
      ellipse(this.pos.x, this.pos.y, particleSize)
    }
}