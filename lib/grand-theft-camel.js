Game = {
    map_grid: {
        width: 39,
        height: 18,
        tile: {
            width: 32,
            height: 32
        }
    },
    width: function() {
        return Game.map_grid.width * this.map_grid.tile.width;
    },
    height: function() {
        return Game.map_grid.height * this.map_grid.tile.height;
    },
    playerKeys: Array(),
    playerLocation: Object,
    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background("tan");
        playerKeys = [];
        playerKeys["M"] = false;
        Crafty.scene("Loading");
    }
};

$text_css = {
    "font-size": "24px",
    "font-family": "Arial",
    color: "white",
    "text-align": "center"
};

window.addEventListener("load", Game.start);

Crafty.scene("Game", function() {
    this.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }
    this.player = Crafty.e("Player").at(5, 5);
    Game.player = this.player;
    this.occupied[this.player.at().x][this.player.at().y] = true;
    var i = 0;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
            if (at_edge) {
                Crafty.e("Tree").at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < .01 && x != 5 && y != 5) {
                i++;
                Crafty.e("Bush").at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }
    var max_camels = Math.round(Crafty.math.randomNumber(0, 5));
    console.log(max_camels);
    this.camels = Array();
    var camelCount = 0;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < .02) {
                if (Crafty("Camel").length <= max_camels && !this.occupied[x][y]) {
                    this.camels[camelCount] = Crafty.e("Camel").at(x, y);
                    this.camels[camelCount].targetLocation = this.camels[camelCount].createRandomTarget();
                }
            }
        }
    }
    for (var i = 0; i < 4; ) {
        var enemy_x = Math.round(Crafty.math.randomNumber(1, 37));
        var enemy_y = Math.round(Crafty.math.randomNumber(1, 18));
        if (!this.occupied[enemy_x][enemy_y]) {
            this.enemy = Crafty.e("Enemy").at(enemy_x, enemy_y);
            break;
        } else {
            i++;
        }
    }
    Game.enemy = this.enemy;
    Game.camels = this.camels;
});

Crafty.scene("Loading", function() {
    Crafty.e("2D, DOM, Text").text("Loading; please wait...").attr({
        x: 0,
        y: Game.height() / 2 - 24,
        w: Game.width()
    }).css($text_css);
    Crafty.load([ "assets/actors/camel.png", "assets/actors/player_character.png", "assets/actors/lead_camel_white.png" ], function() {
        Crafty.sprite(32, 32, "assets/actors/camel_32.png", {
            spr_camel: [ 0, 2, 0, 0 ]
        });
        Crafty.sprite(32, 32, "assets/actors/player_character.png", {
            spr_white_player: [ 1, 0, 0, 0 ]
        });
        Crafty.sprite(32, 40, "assets/actors/lead_camel_white.png", {
            spr_lead_camel_white: [ 0, 1, 0, 0 ]
        });
        Crafty.scene("Game");
    });
});

Crafty.c("Camel", {
    init: function() {
        this.requires("Solid, Actor, Fourway, SpriteAnimation, Collision, spr_camel, TargetMovement").attr({
            steps: 0,
            direction: null,
            maxSteps: 0,
            targetLocation: {
                x: 0,
                y: 0
            }
        });
        this.attr.maxSteps = Math.round(Crafty.math.randomNumber(50, 100));
        this._speed = 1;
        this._oldMovementx;
        this._oldMovementy;
        this.reel("CamelMovingUp", 400, 0, 9, 3).reel("CamelMovingRight", 400, 0, 2, 11).reel("CamelMovingLeft", 400, 0, 8, 11).onHit("Scenery", function(data) {
            if (this.has("TargetMovement")) {
                this.changeDirection();
            } else if (this.has("Follower")) {
                this.moveOffScenery(data);
            }
        }).bind("NewDirection", function(movement) {
            if (movement.x != this._oldMovementx || movement.y != this._oldMovementy) {
                if (movement.y == -1) {
                    this.animate("CamelMovingUp", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.y == 1) {
                    console.log("move south");
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.x == 1) {
                    this.animate("CamelMovingRight", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.x == -1 && !this.isPlaying("CamelMovingUp")) {
                    this.animate("CamelMovingLeft", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else {
                    this.pauseAnimation();
                }
            }
        });
    },
    generateMaxSteps: function() {
        this.attr.maxSteps = Math.round(Crafty.math.randomNumber(250, 500));
    },
    animateEntity: function(directionData) {},
    changeDirection: function() {
        this.targetLocation = this.createRandomTarget();
        this.generateMaxSteps();
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
        var delayValue = Math.round(Crafty.math.randomNumber(1e3, 2e3));
        this.timeout;
        (function() {
            console.log("5000 later");
            this.trigger("Moved");
        }), 5e3;
    },
    createRandomTarget: function() {
        var x = Math.round(Crafty.math.randomNumber(32, Game.map_grid.width * 35));
        var y = Math.round(Crafty.math.randomNumber(32, Game.map_grid.height * 14));
        return {
            x: x,
            y: y
        };
    }
});

Crafty.c("Follower", {
    colors: Array("blue", "yellow", "red", "orange", "rgb(0,0,0)", "rgb(255,255,255)"),
    init: function() {
        this.requires("Actor, Collision, Camel").attr({
            previousLocation: {
                x: 0,
                y: 0
            }
        }).onHit("Scenery", function(data) {
            if (this._parent) {
                this.moveOffScenery(data);
            }
        });
    },
    moveOffScenery: function(data) {
        var LeadCamel = this._parent;
        this.z = LeadCamel.z - 5;
        var followersIndex = LeadCamel.followers.indexOf(this);
        switch (LeadCamel.attr.direction) {
          case "UP":
            this.x = LeadCamel.x;
            this.y = data[0].obj.y - Game.map_grid.tile.width;
            if (LeadCamel.followers.length > 1) {
                this.moveSubsequentFollowers(followersIndex, this.x, this.y);
            }
            break;

          case "DOWN":
            this.x = LeadCamel.x;
            this.y = data[0].obj.y + Game.map_grid.tile.width;
            if (LeadCamel.followers.length > 1) {
                this.moveSubsequentFollowers(followersIndex, this.x, this.y);
            }
            break;

          case "LEFT":
            this.x = data[0].obj.x - Game.map_grid.tile.width;
            this.y = LeadCamel.y;
            if (LeadCamel.followers.length > 1) {
                this.moveSubsequentFollowers(followersIndex, this.x, this.y);
            }
            break;

          case "RIGHT":
            this.x = data[0].obj.x + Game.map_grid.tile.width;
            this.y = LeadCamel.y;
            if (LeadCamel.followers.length > 1) {
                this.moveSubsequentFollowers(followersIndex, this.x, this.y);
            }
            break;
        }
    },
    moveSubsequentFollowers: function(followersIndex, x, y) {
        var LeadCamel = this._parent;
        for (var i = followersIndex + 1; i < LeadCamel.followers.length; i++) {
            LeadCamel.followers[i].z = LeadCamel.followers[i - 1].z;
            LeadCamel.followers[i].x = x;
            LeadCamel.followers[i].y = y;
        }
    },
    stopParent: function() {
        this.z = LeadCamel.z - 50;
        this.x = LeadCamel.x;
        this.y = LeadCamel.y;
    }
});

Crafty.c("Enemy", {
    init: function() {
        this.requires("Actor, Fourway, Collision, SpriteAnimation, Solid, spr_white_player, TargetMovement").attr({
            steps: 0,
            direction: null,
            maxSteps: 0,
            targetLocation: {
                x: null,
                y: null
            }
        });
        this._speed = 1;
        this.bind("EnterFrame", function() {
            this.trigger("Moved");
        }).reel("EnemyUp", 400, 0, 2, 3).reel("EnemyDown", 400, 0, 0, 3).reel("EnemyRight", 400, 0, 3, 3).reel("EnemyLeft", 400, 0, 1, 3).bind("NewDirection", function(movement) {
            if (movement.x != this._oldMovementx || movement.y != this._oldMovementy) {
                if (movement.y == -1) {
                    this.animate("EnemyUp", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.y == 1) {
                    this.animate("EnemyDown", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.x == 1) {
                    this.animate("EnemyRight", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else if (movement.x == -1 && !this.isPlaying("EnemyUp")) {
                    this.animate("EnemyLeft", -1);
                    this._oldMovementx = movement.x;
                    this._oldMovementy = movement.y;
                } else {
                    this.pauseAnimation();
                }
            }
        }).onHit("Scenery", function(data) {
            if (this.has("TargetMovement")) {
                this.changeDirection();
            }
        });
    },
    stopMovement: function(data) {
        if (this.steps > 0) {
            this.steps = 0;
        }
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
        if (data[0].obj.has("Camel")) {
            this.mount(data);
        }
    },
    generateMaxSteps: function() {
        this.attr.maxSteps = Math.round(Crafty.math.randomNumber(50, 150));
    },
    changeDirection: function() {
        this.targetLocation = this.createRandomTarget();
        this.generateMaxSteps();
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
        var delayValue = Math.round(Crafty.math.randomNumber(1e3, 2e3));
        this.timeout;
        (function() {
            this.trigger("Moved");
        }), 5e3;
    },
    createRandomTarget: function() {
        var negPos = [ -1, 1 ];
        var x = Math.round(Crafty.math.randomNumber(this.x - 200, this.x + 200));
        var y = Math.round(Crafty.math.randomNumber(this.y - 200, this.y + 200));
        return {
            x: x,
            y: y
        };
    },
    mount: function(data) {
        var camel = data[0].obj;
        if (Game.playerKeys["M"]) {
            camel.destroy();
            var leadCamel = Crafty.e("LeadCamel");
            leadCamel.followers = Array();
            leadCamel.x = this.x;
            leadCamel.y = this.y;
            switch (this.attr.direction) {
              case "UP":
                leadCamel.animate("LeadCamelMovingUp", -1);
                break;

              case "DOWN":
                break;

              case "LEFT":
                leadCamel.animate("LeadCamelMovingLeft", -1);
                break;

              case "RIGHT":
                leadCamel.animate("LeadCamelMovingRight", -1);
                break;
            }
            this.destroy();
        }
    }
});

Crafty.c("LeadCamel", {
    currentDir: null,
    previousDir: null,
    followers: Array(),
    init: function() {
        this.requires("Actor, Fourway, Collision, SpriteAnimation, spr_lead_camel_white").fourway(2).attr({
            steps: 0,
            direction: null
        }).bind("Moved", function(oldLocation) {
            this.steps++;
            if (this.steps % (Game.map_grid.tile.width / 2) === 0 && this.followers.length > 0) {
                this.arrangeFollowers(oldLocation);
            }
        }).bind("KeyDown", function(e) {
            switch (e.key) {
              case Crafty.keys["M"]:
                Game.playerKeys["M"] = true;
                this.dismount();
                break;

              case Crafty.keys["R"]:
                this.attack();
                break;
            }
        }).bind("KeyUp", function(e) {
            switch (e.key) {
              case Crafty.keys["M"]:
                Game.playerKeys["M"] = false;
                break;
            }
        }).onHit("Camel", function(data) {
            if (!data[0].obj._parent) {
                this.addFollower(data);
            }
        }).onHit("Solid", function(data) {
            this.stopMovement(data);
        }, this.resumeMovement).reel("LeadCamelMovingUp", 400, 0, 2, 3).reel("LeadCamelMovingRight", 400, 0, 1, 11).reel("LeadCamelMovingLeft", 400, 0, 0, 11);
        var animationSpeed = 20;
        this.bind("NewDirection", function(data) {
            var followerArray = this.followers;
            if (data.y == -2) {
                this.attr.direction = "UP";
                this.animate("LeadCamelMovingUp", -1);
                if (followerArray.length > 0) {
                    for (var i = 0; i < followerArray.length; i++) {
                        followerArray[i].animate("CamelMovingUp", -1);
                    }
                }
            } else if (data.y == 2) {
                this.attr.direction = "DOWN";
            } else if (data.x == 2) {
                this.attr.direction = "RIGHT";
                this.animate("LeadCamelMovingRight", -1);
                if (followerArray.length > 0) {
                    for (var i = 0; i < followerArray.length; i++) {
                        followerArray[i].animate("CamelMovingRight", -1);
                    }
                }
            } else if (data.x == -2) {
                this.attr.direction = "LEFT";
                this.animate("LeadCamelMovingLeft", -1);
                if (followerArray.length > 0) {
                    for (var i = 0; i < followerArray.length; i++) {
                        followerArray[i].animate("CamelMovingLeft", -1);
                    }
                }
            } else {
                this.pauseAnimation();
                if (followerArray.length > 0) {
                    for (var i = 0; i < followerArray.length; i++) {
                        followerArray[i].pauseAnimation();
                    }
                }
            }
        });
    },
    stopMovement: function(data) {
        if (this.steps > 0) {
            this.steps = 0;
        }
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },
    dismount: function() {
        for (var i = 0; i < this.followers.length; i++) {
            this.followers[i].addComponent("Solid");
            this.followers[i].addComponent("TargetMovement");
        }
        this.detach();
        this.followers = Array();
        var newPlayer = Crafty.e("Player");
        switch (this.attr.direction) {
          case "UP":
            newPlayer.x = this.x + Game.map_grid.tile.width;
            newPlayer.y = this.y;
            break;

          case "DOWN":
            newPlayer.x = this.x - Game.map_grid.tile.width;
            newPlayer.y = this.y;
            break;

          case "LEFT":
            newPlayer.x = this.x;
            newPlayer.y = this.y + Game.map_grid.tile.width;
            break;

          case "RIGHT":
            newPlayer.x = this.x;
            newPlayer.y = this.y + Game.map_grid.tile.width;
            break;
        }
        var newCamel = Crafty.e("Follower");
        newCamel.x = this.x;
        newCamel.y = this.y;
        this.destroy();
    },
    addFollower: function(data) {
        var follower = data[0].obj;
        var followerArray = this.followers;
        follower.removeComponent("TargetMovement", false);
        follower.unbind("Moved");
        follower.removeComponent("Solid");
        follower.addComponent("Follower");
        this.attach(follower);
        this.followers.push(follower);
        this.trigger("NewDirection", this._movement);
    },
    arrangeFollowers: function(oldLocation) {
        var followerArray = this.followers;
        if (followerArray.length > 0) {
            for (var i = 0; i < followerArray.length; i++) {
                followerArray[i].setName("follower " + i);
                followerArray[i].previousLocation.x = followerArray[i].x + this._movement.x;
                followerArray[i].previousLocation.y = followerArray[i].y + this._movement.y + 8;
                var x = i == 0 ? oldLocation.x : followerArray[i - 1].previousLocation.x;
                var y = i == 0 ? oldLocation.y : followerArray[i - 1].previousLocation.y;
                var followerExtraSpace = i == 0 ? 0 : 4;
                switch (this.attr.direction) {
                  case "UP":
                    followerArray[i].x = x;
                    followerArray[i].y = y + Game.map_grid.tile.width + followerExtraSpace;
                    if (i == 0) {
                        followerArray[i].y = followerArray[i].y + 8;
                    } else {
                        followerArray[i].y = followerArray[i].y - 8;
                    }
                    break;

                  case "DOWN":
                    followerArray[i].x = x;
                    followerArray[i].y = y - Game.map_grid.tile.width - followerExtraSpace;
                    break;

                  case "LEFT":
                    followerArray[i].x = x + Game.map_grid.tile.width + followerExtraSpace;
                    followerArray[i].y = y;
                    if (i == 0) {
                        followerArray[i].y = followerArray[i].y + 8;
                    } else {
                        followerArray[i].y = followerArray[i].y - 8;
                    }
                    break;

                  case "RIGHT":
                    followerArray[i].x = x - Game.map_grid.tile.width - followerExtraSpace;
                    followerArray[i].y = y;
                    if (i == 0) {
                        followerArray[i].y = followerArray[i].y + 8;
                    } else {
                        followerArray[i].y = followerArray[i].y - 8;
                    }
                    break;
                }
            }
        }
    }
});

Crafty.c("Player", {
    init: function() {
        this.requires("Actor, Fourway, Collision, SpriteAnimation, Solid, spr_white_player").fourway(1).reel("PlayerUp", 400, 0, 2, 3).reel("PlayerDown", 400, 0, 0, 3).reel("PlayerRight", 400, 0, 3, 3).reel("PlayerLeft", 400, 0, 1, 3).bind("KeyDown", function(e) {
            switch (e.key) {
              case Crafty.keys["M"]:
                Game.playerKeys["M"] = true;
                break;

              case Crafty.keys["R"]:
                this.fourway(2);
                break;
            }
        }).bind("KeyUp", function(e) {
            switch (e.key) {
              case Crafty.keys["M"]:
                Game.playerKeys["M"] = false;
                break;

              case Crafty.keys["R"]:
                this.fourway(1);
                break;
            }
        }).onHit("Solid", function(data) {
            this.stopMovement(data);
        }).bind("Moved", function() {});
        var animationSpeed = 16;
        this.bind("NewDirection", function(data) {
            if (data.y == -1) {
                this.attr.direction = "UP";
                this.animate("PlayerUp", -1);
            } else if (data.y == 1) {
                this.attr.direction = "DOWN";
                this.animate("PlayerDown", -1);
            } else if (data.x == 1) {
                this.attr.direction = "RIGHT";
                this.animate("PlayerRight", -1);
            } else if (data.x == -1) {
                this.attr.direction = "LEFT";
                this.animate("PlayerLeft", -1);
            } else {
                this.pauseAnimation();
            }
        });
    },
    stopMovement: function(data) {
        if (this.steps > 0) {
            this.steps = 0;
        }
        this._speed = 0;
        if (this._movement) {
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
        if (data[0].obj.has("Camel")) {
            this.mount(data);
        }
    },
    mount: function(data) {
        var camel = data[0].obj;
        if (Game.playerKeys["M"]) {
            camel.destroy();
            var leadCamel = Crafty.e("LeadCamel");
            leadCamel.followers = Array();
            leadCamel.x = this.x;
            leadCamel.y = this.y;
            switch (this.attr.direction) {
              case "UP":
                leadCamel.animate("LeadCamelMovingUp", -1);
                break;

              case "DOWN":
                break;

              case "LEFT":
                leadCamel.animate("LeadCamelMovingLeft", -1);
                break;

              case "RIGHT":
                leadCamel.animate("LeadCamelMovingRight", -1);
                break;
            }
            this.destroy();
        }
    }
});

Crafty.c("Grid", {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        });
    },
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x / Game.map_grid.tile.width,
                y: this.y / Game.map_grid.tile.height
            };
        } else {
            this.attr({
                x: x * Game.map_grid.tile.width,
                y: y * Game.map_grid.tile.height
            });
            return this;
        }
    }
});

Crafty.c("Actor", {
    init: function() {
        this.requires("2D, Canvas, Grid");
    }
});

Crafty.c("Scenery", {
    init: function() {
        this.requires("Actor, Color, Solid, Collision").color("rgb(20, 125, 40)");
    }
});

Crafty.c("Tree", {
    init: function() {
        this.requires("Scenery").color("rgb(20, 125, 40)");
    }
});

Crafty.c("Bush", {
    init: function() {
        this.requires("Scenery").color("rgb(20, 185, 40)");
    }
});

Crafty.c("TargetMovement", {
    init: function() {
        this.requires("Fourway, Delay");
        this.oldLocation;
        this._movement = {
            x: null,
            y: null
        };
        this._movementOld = {};
        this.bind("EnterFrame", function() {
            this.trigger("Moved");
        }).bind("Moved", function(data) {
            this.move();
        });
    },
    move: function() {
        if (this.targetLocation.x == null) {
            this.targetLocation = this.createRandomTarget();
        }
        var target = this.targetLocation;
        var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
        if (distanceToTarget == 0 || distanceToTarget == 1 || this.attr.maxSteps == 0) {
            this.changeDirection();
        } else {
            this.oldLocation = {
                x: this.x,
                y: this.y
            };
            this.diffx = this.x - target.x;
            this.diffy = this.y - target.y;
            this._angle = Math.atan(this.diffy / this.diffx);
            var dirmodx;
            var dirmody;
            if (this.diffx > 0) {
                dirmodx = -1;
            } else {
                dirmodx = 1;
            }
            if (this.diffy > 0) {
                dirmody = -1;
            } else {
                dirmody = 1;
            }
            this.x += Math.round(Math.cos(this._angle) * this._speed * dirmodx);
            this.y += Math.round(Math.sin(this._angle) * this._speed * dirmody);
            this._movement.x = this.x - this.oldLocation.x;
            this._movement.y = this.y - this.oldLocation.y;
            this.trigger("NewDirection", this._movement);
        }
    },
    _round8: function(d) {
        return Math.round(d * 1e8) / 1e8;
    }
});