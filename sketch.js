var obstaclesGroup, obstacle1, obstacle2
var coin, coinGroup
var score = -1
var lives = 3
var handleControl = true
var restart, restartImg

function setup() {
  createCanvas(800,400);

  bg = createSprite(2500,30,3000,300)
  bg.addImage(bg_image)
  zombie = createSprite(3000, 200, 50, 50)
  zombie.addImage(zombieImg)
  zombie.scale = 0.1
  chest = createSprite(4589, 200, 50, 50);
  chest.scale = 0.3
  chest.addImage(chestImg)
  plr = createSprite(478, 200, 50, 50);
  plr.addAnimation("idle", plr_idle)
  plr.addAnimation("run", plr_run)
  plr.addAnimation("hurt", plr_hurt)
  plr.addAnimation("dead", plr_dead)

  restart = createSprite(1500, 150)
  restart.addImage(restartImg)
  restart.scale=0.2
  jump = createSprite(plr.x, plr.y)
  jump.addImage(jumpButton)
  jump.scale = 0.6

  plr.scale = 0.3
  plr.setCollider("rectangle", 50,0, 200,430)
  zombie.setCollider("rectangle", 50,0, 200,430)
  ground = createSprite(2500,plr.y+100,5000,10)
  ground.visible = false

  obstaclesGroup = new Group();
  coinGroup = new Group();

  wall1 = createSprite(478,200,20,500)
  wall1.visible = false
  wall2 = createSprite(4589,200,20,500)
  wall2.visible = false

  restart.visible = false

  spawnObstacles();
  spawnCoins();
}

function preload(){
  bg_image = loadImage("bg.jpg")
  plr_idle = loadAnimation("png/idle2.png")
  plr_run = loadAnimation("png/run1.png", "png/run2.png", "png/run3.png", "png/run4.png", "png/run5.png", "png/run6.png", "png/run7.png", "png/run8.png",)
  plr_hurt = loadAnimation("png/hurt1.png")
  plr_dead = loadAnimation("png/dead10.png")
  zombieImg = loadImage("png/zombie.png")
  chestImg = loadImage("png/chest.png")
  obstacle1 = loadImage("png/obstacle1.png")
  obstacle2 = loadImage("png/obstacle2.png")  
  coinImg = loadImage("png/coin.png")
  restartImg = loadImage("restart.webp")
  jumpButton = loadImage("png/jumpButton.png")
}

function draw() {
  background(0); 
  drawSprites();

  plr.collide(wall1)
  zombie.collide(wall1)
  plr.collide(wall2)
  zombie.collide(wall2)
  plr.collide(ground)
  zombie.collide(ground)
  chest.collide(ground)

  jump.x = plr.x + 330
  jump.y = plr.y + 30

  restart.x = plr.x
  restart.y = plr.y - 110
  
  if(plr.isTouching(chest)){
    fill("white")
    stroke(3)
    textSize(45)
    text('YOU WIN! YOUR SCORE WAS: ' +score, plr.x-350,plr.y-100)
    reset.visible = true
    zombie.velocityX = 0
    plr.velocityX = 0
    handleControl = false
  }

  if(plr.isTouching(wall1)){
    fill("black")
    stroke(3)
    text("Press Right Arrow Key to Start the Game", wall1.x,100)
    plr.collide(wall1)
  }

  if(mousePressedOver(restart)){
    reset();
  }

  if(handleControl == true){

    if(keyDown("up")&& plr.y>190){
        plr.velocityY = -24
      }

    if(keyDown("space")&& plr.y>190){
        plr.velocityY = -15
        zombie.velocityY = -10
      }
      plr.velocityY += 1
      zombie.velocityY += 1

      if(mousePressedOver(jump)&& plr.y>190){
        plr.velocityY = -15
        zombie.velocityY = -10
      }
        plr.velocityY += 1
        zombie.velocityY += 1

    
    if(keyWentDown(RIGHT_ARROW)){
      plr.changeAnimation("run")
      plr.velocityX=8
      plr.mirrorX(1)
    }
    if(keyWentUp(RIGHT_ARROW)){
      plr.changeAnimation("idle")
      plr.velocityX=0
    }
    
    if(keyWentDown(LEFT_ARROW)){
      plr.changeAnimation("run")
      plr.velocityX=-8
      plr.mirrorX(-1)
    }
    if(keyWentUp(LEFT_ARROW)){
      plr.changeAnimation("idle")
      plr.velocityX=0
    }
  }
    stroke(3)
    textSize(32)
    fill("black")
    text('Score: '+score, plr.x+200,plr.y-250)
    text('Lives: '+lives, plr.x+50,plr.y-250)

    textSize(16)
    text('Press the UP ARROW to Super Jump!', plr.x-375,plr.y-250)

  if(plr.y>100){
    camera.y=plr.y-100;
  }
  camera.x=plr.x;

// if(coinGroup.isTouching(plr)){
//   score+=1
//   coinGroup[1].destroy()
// }

  plr.collide(coinGroup, getReward)
  plr.collide(obstaclesGroup, loseLife)
  zombie.collide(obstaclesGroup)

// if(plr.isTouching(obstaclesGroup)){
//   obstaclesGroup[1].destroy()
//   lives-=1
//   plr.velocityX = 0;
//   plr.changeAnimation("hurt")
//   }

  if(plr.x>zombie.x){
    zombie.velocityX=4
    zombie.mirrorX(1)
  }else{
    zombie.velocityX=-4
    zombie.mirrorX(-1)
  }

  if(zombie.isTouching(obstaclesGroup)){
    zombie.velocityX = 0
  }

  if(zombie.isTouching(plr)){
    lives-=1
    plr.changeAnimation("hurt")
    plr.velocityX = 0;
    zombie.x = zombie.x + 250
    zombie.velocityX = 0
  }

  if(lives <=0){
    textSize(60)
    fill("white")
    text('YOU LOSE! YOUR SCORE WAS:', +score, plr.x-100, plr.y-50)
    plr.velocityX = 0
    handleControl = false
    plr.changeAnimation("dead")
    restart.visible = true
    zombie.VelocityX = 0
    zombie.x=3000
  }
}

function spawnObstacles(){
  for(var i=0; i<4000; i+=400)  {
    var obstacle = createSprite(i, random(250,280), 10, 40);
    var rand = Math.round(random(1,2));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }

    obstacle.scale = 0.15;
    obstaclesGroup.add(obstacle)
    obstacle.setCollider("circle", 100, 200, 100)
    obstacle.depth=plr.depth+1
  }
}

function spawnCoins(){
  for(var i=0; i<4000; i+=500)  {
    var coin = createSprite(i, 110, 10, 40);
    //var rand = Math.round(random(1,1));
    //switch(rand){
    //  case 1: coin.addImage(coinImg);
    //          break;
    //  default: break;
    //}
    coin.scale = 0.1;
    coin.addImage(coinImg)
    coinGroup.add(coin)
    coin.depth=plr.depth+1
  }
}

function reset(){
  restart.visible = false
  plr.changeAnimation("idle", plr_idle)
  spawnObstacles();
  spawnCoins();
  score = 0
  plr.x=478
  lives = 3
  handleControl = true
}

function getReward(plr, coin){
  coin.remove()
  score+=1
}

function loseLife(plr, obstacle){
  obstacle.remove()
  lives-=1
  plr.changeAnimation("hurt")
  plr.velocityX = 0;
}