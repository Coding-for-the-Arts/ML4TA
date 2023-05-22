
class Emitter {
    constructor(x, y) {
      this.position = createVector(x, y);
        this.particles = [];
        this.angle = 0
    }
  
    emit(num) {
      for (let i = 0; i < num; i++) {
        this.particles.push(new Particle(this.position.x, this.position.y));
      }
    }
  
    update() {
      for (let particle of this.particles) {
        let gravity = createVector(0.5, 0.5);
        gravity.rotate(this.angle)
        particle.applyForce(gravity);
        particle.update();
        this.angle+=10
      }
  
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].finished()) {
          this.particles.splice(i, 1);
        }
      }
    }
  
    show() {
      for (let particle of this.particles) {
        particle.show();
      }
    }
  }
  