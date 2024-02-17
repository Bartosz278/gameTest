import { interactiveObstacles } from "src/objects.js";
interface Obstacle {
    x: number;
    y: number;
    // inne właściwości
    digTime: number;
}

export class Player {
    ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    isCollidingWithObstacle: (obstacles: Obstacle[], x: number, y: number) => boolean;
    interactiveObstacles: Obstacle[];
    showCollectInfo: (id: string, show: boolean, text: string, x: number, y: number) => void;
    collectItem: (index: number) => void;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    isCollecting: boolean;
  
    constructor(
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
      isCollidingWithObstacle: (obstacles: Obstacle[], x: number, y: number) => boolean,
      interactiveObstacles: Obstacle[],
      showCollectInfo: (id: string, show: boolean, text: string, x: number, y: number) => void,
      collectItem: (index: number) => void
    ) {
      this.ctx = ctx;
      this.img = img;
      this.canvas = canvas;
      this.isCollidingWithObstacle = isCollidingWithObstacle;
      this.interactiveObstacles = interactiveObstacles;
      this.showCollectInfo = showCollectInfo;
      this.collectItem = collectItem;
      this.x = canvas.width / 2 - 15;
      this.y = canvas.height / 2 - 15;
      this.width = 30;
      this.height = 30;
      this.speed = 8;
      this.isCollecting = false;
    }
  
    drawPlayer(): void {
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  
    move(event: KeyboardEvent): void {
      let newX = this.x;
      let newY = this.y;
  
      switch (event.key) {
        case "w":
        case "ArrowUp":
          newY -= this.speed;
          break;
        case "s":
        case "ArrowDown":
          newY += this.speed;
          break;
        case "a":
        case "ArrowLeft":
          newX -= this.speed;
          break;
        case "d":
        case "ArrowRight":
          newX += this.speed;
          break;
      }
  
      if (!this.isCollidingWithObstacle(this.interactiveObstacles, newX, newY)) {
        this.x = newX;
        this.y = newY;
      }
  
      if (event.key === " " && !this.isCollecting) {
        this.tryCollecting();
      }
    }
  
    tryCollecting(): void {
      for (let i = this.interactiveObstacles.length - 1; i >= 0; i--) {
        let obstacle = this.interactiveObstacles[i];
        let distance = Math.sqrt(
          Math.pow(this.x - obstacle.x, 2) + Math.pow(this.y - obstacle.y, 2)
        );
        if (distance < 50) {
          this.isCollecting = true;
          this.showCollectInfo(
            "infoBox",
            true,
            "Collecting...",
            this.x + 20,
            this.y - 20
          );
          setTimeout(() => {
            this.collectItem(i);
            this.isCollecting = false;
            this.showCollectInfo("infoBox", false, "x", this.x + 20, this.y - 20);
          }, obstacle.digTime);
          break;
        }
      }
    }
  }